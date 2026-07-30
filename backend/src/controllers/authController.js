import crypto from "crypto";
import { db } from "../db/db.js";
import { activeSessions } from "../middlewares/authMiddleware.js";

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Veuillez fournir un nom d'utilisateur et un mot de passe.",
        });
    }

    try {
        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

        if (!user) {
            return res.status(401).json({
                error: "Nom d'utilisateur ou mot de passe incorrect.",
            });
        }

        if (user.is_locked === 1) {
            return res.status(403).json({
                error: "Compte verrouillé. Veuillez contacter l'administrateur ou réinitialiser le mot de passe.",
            });
        }

        const derivedKey = crypto.pbkdf2Sync(password, user.salt, 100000, 64, "sha512");
        const calculatedHash = derivedKey.toString("hex");

        if (calculatedHash === user.password_hash) {
            // Reset failed attempts
            db.prepare("UPDATE users SET failed_attempts = 0 WHERE id = ?").run(user.id);

            const sessionId = crypto.randomBytes(32).toString("hex");

            activeSessions.set(sessionId, {
                id: user.id,
                username: user.username,
                roleId: user.roleId,
            });

            res.cookie("sessionId", sessionId, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });

            db.prepare("INSERT INTO security_logs (event) VALUES (?)").run(
                `Connexion réussie pour l'utilisateur : ${username}`
            );

            console.log("User successfully logged in");

            return res.json({ username: user.username, roleId: user.roleId });
        } else {
            const newAttempts = user.failed_attempts + 1;
            const config = db.prepare("SELECT value FROM security_config WHERE key = 'max_attempts'").get();
            const maxAttempts = config ? parseInt(config.value) : 3;

            if (newAttempts >= maxAttempts) {
                db.prepare("UPDATE users SET failed_attempts = ?, is_locked = 1 WHERE id = ?").run(newAttempts, user.id);
                db.prepare("INSERT INTO security_logs (event) VALUES (?)").run(
                    `Compte verrouillé (trop d'échecs) : ${username}`
                );

                return res.status(403).json({
                    error: "Compte bloqué suite à un dépassement du nombre maximal de tentatives.",
                });
            } else {
                db.prepare("UPDATE users SET failed_attempts = ? WHERE id = ?").run(newAttempts, user.id);
                db.prepare("INSERT INTO security_logs (event) VALUES (?)").run(
                    `Tentative de connexion échouée pour : ${username}`
                );

                return res.status(401).json({
                    error: "Nom d'utilisateur ou mot de passe incorrect.",
                });
            }
        }
    } catch (err) {
        console.error("❌ Erreur login :", err.message);
        return res.status(500).json({ error: "Erreur interne du serveur." });
    }
};

export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;
        const username = req.user ? req.user.username : "Inconnu";

        if (sessionId) {
            activeSessions.delete(sessionId);
        }

        res.clearCookie("sessionId");

        const logMessage = `Déconnexion réussie pour l'utilisateur : ${username}`;
        db.prepare("INSERT INTO security_logs (event) VALUES (?)").run(logMessage);

        return res.json({ message: "Déconnexion réussie." });
    } catch (err) {
        console.error("❌ Erreur logout :", err.message);
        return res.status(500).json({ error: "Erreur lors de la déconnexion." });
    }
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    const userId = req.user.id;

    if (newPassword !== newPasswordConfirm) {
        return res.status(400).json({ error: "Les nouveaux mots de passe ne correspondent pas." });
    }

    try {
        const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
        if (!user) {
            return res.status(500).json({ error: "Erreur lors de la réauthentification." });
        }

        const currentHash = crypto.pbkdf2Sync(currentPassword, user.salt, 100000, 64, "sha512").toString("hex");
        if (currentHash !== user.password_hash) {
            return res.status(401).json({
                error: "Le mot de passe actuel est incorrect. Réauthentification échouée.",
            });
        }

        // Validate min length policy
        const minLengthConfig = db.prepare("SELECT value FROM security_config WHERE key = 'min_length'").get();
        const minLength = minLengthConfig ? parseInt(minLengthConfig.value) : 8;

        if (newPassword.length < minLength) {
            return res.status(400).json({
                error: `Le nouveau mot de passe doit contenir au moins ${minLength} caractères.`,
            });
        }

        // Validate history limit policy
        const historyConfig = db.prepare("SELECT value FROM security_config WHERE key = 'password_history_limit'").get();
        const historyLimit = historyConfig ? parseInt(historyConfig.value) : 3;

        const historyRows = db.prepare(
            "SELECT password_hash FROM password_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?"
        ).all(userId, historyLimit);

        const newHash = crypto.pbkdf2Sync(newPassword, user.salt, 100000, 64, "sha512").toString("hex");

        const passwordIsOld = historyRows.some((row) => row.password_hash === newHash);
        if (passwordIsOld || newHash === user.password_hash) {
            return res.status(400).json({
                error: `Vous ne pouvez pas réutiliser l'un de vos ${historyLimit} derniers mots de passe.`,
            });
        }

        // Execute updates inside an atomic transaction (replaces db.serialize)
        const updatePasswordTransaction = db.transaction(() => {
            db.prepare("INSERT INTO password_history (user_id, password_hash) VALUES (?, ?)").run(
                userId,
                user.password_hash
            );
            db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(newHash, userId);
            db.prepare("INSERT INTO security_logs (event) VALUES (?)").run(
                `Changement de mot de passe réussi pour l'utilisateur : ${user.username}`
            );
        });

        updatePasswordTransaction();

        return res.json({
            message: "Votre mot de passe a été modifié avec succès.",
        });

    } catch (err) {
        console.error("❌ Erreur changePassword :", err.message);
        return res.status(500).json({
            error: "Erreur lors du changement de mot de passe.",
        });
    }
};