import crypto from "crypto";
import { db } from "../db/db.js";

export const getSecurityConfig = async (req, res) => {
	const query = "SELECT * FROM security_config";

	db.all(query, [], (err, rows) => {
		if (err) {
			return res.status(500).json({
				error: "Erreur lors de la récupération des configurations.",
			});
		}
		return res.json(rows);
	});
};

export const updateSecurityConfig = async (req, res) => {
	const newConfigs = req.body;

	if (!newConfigs || Object.keys(newConfigs).length === 0) {
		return res.status(400).json({ error: "Aucune configuration fournie." });
	}

	db.serialize(() => {
		let hasError = false;

		for (const [key, value] of Object.entries(newConfigs)) {
			const query = "UPDATE security_config SET value = ? WHERE key = ?";

			db.run(query, [String(value), key], (err) => {
				if (err) {
					console.error(`❌ Erreur lors de la mise à jour de ${key} :`, err.message);
					hasError = true;
				}
			});
		}

		db.run("INSERT INTO security_logs (event) VALUES (?)", [
			"Paramètres de sécurité mis à jour par l'Administrateur.",
		]);

		if (hasError) {
			return res.status(500).json({
				error: "Certains paramètres n'ont pas pu être mis à jour.",
			});
		} else {
			return res.json({
				message: "Configurations de sécurité mises à jour avec succès.",
			});
		}
	});
};

export const createUser = async (req, res) => {
	const { username, password, passwordConfirm, role } = req.body;

	if (password !== passwordConfirm) {
		return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
	}

	const validRoles = ["Administrateur", "Préposé aux clients résidentiels", "Préposé aux clients d'affaires"];
	if (!validRoles.includes(role)) {
		return res.status(400).json({ error: "Le rôle spécifié est invalide." });
	}

	if (!username || !password) {
		return res.status(400).json({
			error: "Le nom d'utilisateur et le mot de passe sont requis.",
		});
	}

	db.get("SELECT value FROM security_config WHERE key = 'min_length'", (err, config) => {
		if (err)
			return res.status(500).json({
				error: "Erreur lors de la vérification des politiques de sécurité.",
			});

		const minLength = config ? parseInt(config.value) : 8;
		if (password.length < minLength) {
			return res.status(400).json({
				error: `Le mot de passe doit contenir au moins ${minLength} caractères.`,
			});
		}

		db.get("SELECT id FROM users WHERE username = ?", [username], (err, existingUser) => {
			if (err) return res.status(500).json({ error: "Erreur interne du serveur." });
			if (existingUser) {
				return res.status(400).json({
					error: "Ce nom d'utilisateur est déjà utilisé.",
				});
			}

			const salt = crypto.randomBytes(16).toString("hex");
			const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");

			const insertQuery = `
                        INSERT INTO users (username, password_hash, salt, role, failed_attempts, is_locked) 
                        VALUES (?, ?, ?, ?, 0, 0)
                    `;

			db.run(insertQuery, [username, hash, salt, role], function (err) {
				if (err) {
					return res.status(500).json({
						error: "Erreur lors de la création de l'utilisateur.",
					});
				}

				db.run("INSERT INTO security_logs (event) VALUES (?)", [
					`Nouvel utilisateur créé par l'admin : ${username} (${role})`,
				]);

				return res.status(201).json({
					message: `L'utilisateur ${username} a été créé avec succès.`,
				});
			});
		});
	});
};
