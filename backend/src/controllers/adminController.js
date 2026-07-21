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
    let newConfigs = req.body;

    if (!newConfigs || (Array.isArray(newConfigs) && newConfigs.length === 0) || Object.keys(newConfigs).length === 0) {
        return res.status(400).json({ error: "Aucune configuration fournie." });
    }

    const entries = Array.isArray(newConfigs) 
        ? newConfigs.map(item => [item.key, item.value])
        : Object.entries(newConfigs);

    try {
        const updatePromises = entries.map(([key, value]) => {
            return new Promise((resolve, reject) => {
                const query = "UPDATE security_config SET value = ? WHERE key = ?";
                db.run(query, [String(value), key], function (err) {
                    if (err) return reject(err);
                    resolve(this.changes);
                });
            });
        });

        await Promise.all(updatePromises);

        db.run("INSERT INTO security_logs (event) VALUES (?)", [
            "Paramètres de sécurité mis à jour par l'Administrateur.",
        ]);

        return res.json({
            message: "Configurations de sécurité mises à jour avec succès.",
        });
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour :", err.message);
        return res.status(500).json({
            error: "Certains paramètres n'ont pas pu être mis à jour.",
        });
    }
};

export const createUser = async (req, res) => {
	const { username, password, passwordConfirm, roleId } = req.body;
	if (password !== passwordConfirm) {
		console.log(password +"-"+passwordConfirm)
		return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
	}

	const validRoles = [1, 2, 3];
	if (!validRoles.includes(roleId)) {
		console.log("penis2")
		return res.status(400).json({ error: "Le rôle spécifié est invalide." });
	}

	if (!username || !password) {
		console.log("penis3")
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
                        INSERT INTO users (username, password_hash, salt, roleId, failed_attempts, is_locked) 
                        VALUES (?, ?, ?, ?, 0, 0)
                    `;

			db.run(insertQuery, [username, hash, salt, roleId], function (err) {
				if (err) {
					return res.status(500).json({
						error: "Erreur lors de la création de l'utilisateur.",
					});
				}

				db.run("INSERT INTO security_logs (event) VALUES (?)", [
					`Nouvel utilisateur créé par l'admin : ${username} (${roleId})`,
				]);

				return res.status(201).json({
					message: `L'utilisateur ${username} a été créé avec succès.`,
				});
			});
		});
	});
};
