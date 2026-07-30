import crypto from "crypto";
import { db } from "../db/db.js";

export const getSecurityConfig = async (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM security_config").all();
        return res.json(rows);
    } catch (err) {
        return res.status(500).json({
            error: "Erreur lors de la récupération des configurations.",
        });
    }
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
        const updateStmt = db.prepare("UPDATE security_config SET value = ? WHERE key = ?");
        
        const updateMany = db.transaction((items) => {
            for (const [key, value] of items) {
                updateStmt.run(String(value), key);
            }
        });

        updateMany(entries);

        db.prepare("INSERT INTO security_logs (event) VALUES (?)").run(
            "Paramètres de sécurité mis à jour par l'Administrateur."
        );

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
    const { username, password, confirmPassword, roleId } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
    }

    const validRoles = [1, 2, 3];
    if (!validRoles.includes(roleId)) {
        return res.status(400).json({ error: "Le rôle spécifié est invalide." });
    }

    if (!username || !password) {
        return res.status(400).json({
            error: "Le nom d'utilisateur et le mot de passe sont requis.",
        });
    }

    try {
        const config = db.prepare("SELECT value FROM security_config WHERE key = 'min_length'").get();
        const minLength = config ? parseInt(config.value) : 8;

        if (password.length < minLength) {
            return res.status(400).json({
                error: `Le mot de passe doit contenir au moins ${minLength} caractères.`,
            });
        }

        const existingUser = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
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
        db.prepare(insertQuery).run(username, hash, salt, roleId);

        db.prepare("INSERT INTO security_logs (event) VALUES (?)").run(
            `Nouvel utilisateur créé par l'admin : ${username} (${roleId})`
        );

        return res.status(201).json({
            message: `L'utilisateur ${username} a été créé avec succès.`,
        });
    } catch (err) {
        console.error("❌ Erreur createUser :", err.message);
        return res.status(500).json({
            error: "Erreur lors de la création de l'utilisateur.",
        });
    }
};

/**
 * Récupère la liste de tous les utilisateurs (id, username, roleId, is_locked, failed_attempts)
 */
export const getAllUsers = async (req, res) => {
    try {
        const query = "SELECT id, username, roleId, is_locked, failed_attempts FROM users";
        const rows = db.prepare(query).all();
        return res.json(rows);
    } catch (err) {
        console.error("❌ Erreur getAllUsers :", err.message);
        return res.status(500).json({
            error: "Erreur lors de la récupération des utilisateurs.",
        });
    }
};

/**
 * Réinitialise le mot de passe d'un utilisateur par l'administrateur
 * et déverrouille le compte si nécessaire.
 */
export const resetUserPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({
            error: "Le nouveau mot de passe est requis.",
        });
    }

    try {
        const config = db.prepare("SELECT value FROM security_config WHERE key = 'min_length'").get();
        const minLength = config ? parseInt(config.value) : 8;

        if (newPassword.length < minLength) {
            return res.status(400).json({
                error: `Le mot de passe doit contenir au moins ${minLength} caractères.`,
            });
        }

        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const newHash = crypto.pbkdf2Sync(newPassword, salt, 100000, 64, "sha512").toString("hex");

        const performReset = db.transaction(() => {
            db.prepare("INSERT INTO password_history (user_id, password_hash) VALUES (?, ?)").run(
                user.id,
                user.password_hash
            );

            const updateQuery = `
                UPDATE users 
                SET password_hash = ?, salt = ?, failed_attempts = 0, is_locked = 0 
                WHERE id = ?
            `;
            db.prepare(updateQuery).run(newHash, salt, id);

            db.prepare("INSERT INTO security_logs (event) VALUES (?)").run(
                `Mot de passe réinitialisé par l'admin pour l'utilisateur : ${user.username}`
            );
        });

        performReset();

        return res.json({
            message: `Le mot de passe de l'utilisateur ${user.username} a été réinitialisé avec succès.`,
        });
    } catch (err) {
        console.error("❌ Erreur resetUserPassword :", err.message);
        return res.status(500).json({
            error: "Erreur lors de la réinitialisation du mot de passe.",
        });
    }
};