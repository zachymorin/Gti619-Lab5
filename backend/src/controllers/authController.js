import crypto from 'crypto';
import { db } from '../db/db.js';
import { activeSessions } from '../middlewares/authMiddleware.js';

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Veuillez fournir un nom d'utilisateur et un mot de passe." });
    }

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Erreur interne du serveur." });
        }

        if (!user) {
            return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        if (user.is_locked === 1) {
            return res.status(403).json({ error: "Compte verrouillé. Veuillez contacter l'administrateur ou réinitialiser le mote de passe." });
        }

        const derivedKey = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512');
        const calculatedHash = derivedKey.toString('hex');

        console.log(calculatedHash)

        if (calculatedHash === user.password_hash) {
            db.run("UPDATE users SET failed_attempts = 0 WHERE id = ?", [user.id]);

            const sessionId = crypto.randomBytes(32).toString('hex');

            activeSessions.set(sessionId, {
                id: user.id,
                username: user.username,
                role: user.role
            });

            res.cookie('sessionId', sessionId, {
                httpOnly: true, // Empêche l'accès avec document.cookie
                secure: false,
                sameSite: 'strict'
            });

            db.run("INSERT INTO security_logs (event) VALUES (?)", [`Connexion réussie pour l'utilisateur : ${username}`]);

            return res.json({ username: user.username, role: user.role });

        } else {
            const newAttempts = user.failed_attempts + 1;

            db.get("SELECT value FROM security_config WHERE key = 'max_attempts'", (err, config) => {
                const maxAttempts = config ? parseInt(config.value) : 3;

                if (newAttempts >= maxAttempts) {
                    db.run("UPDATE users SET failed_attempts = ?, is_locked = 1 WHERE id = ?", [newAttempts, user.id]);
                    db.run("INSERT INTO security_logs (event) VALUES (?)", [`Compte verrouillé (trop d'échecs) : ${username}`]);
                    
                    return res.status(403).json({ error: "Compte bloqué suite à un dépassement du nombre maximal de tentatives." });
                } else {
                    db.run("UPDATE users SET failed_attempts = ? WHERE id = ?", [newAttempts, user.id]);
                    db.run("INSERT INTO security_logs (event) VALUES (?)", [`Tentative de connexion échouée pour : ${username}`]);
                    
                    return res.status(401).json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
                }
            });
        }
    });
};

export const logout = async (req, res) => {
    const sessionId = req.cookies.sessionId;
    
    const username = req.user ? req.user.username : 'Inconnu';

    if (sessionId) {
        activeSessions.delete(sessionId);
    }

    res.clearCookie('sessionId');

    const logQuery = "INSERT INTO security_logs (event) VALUES (?)";
    const logMessage = `Déconnexion réussie pour l'utilisateur : ${username}`;
    db.run(logQuery, [logMessage]);

    return res.json({ message: "Déconnexion réussie." });
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    const userId = req.user.id;

    if (newPassword !== newPasswordConfirm) {
        return res.status(400).json({ error: "Les nouveaux mots de passe ne correspondent pas." });
    }

    db.get("SELECT * FROM users WHERE id = ?", [userId], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: "Erreur lors de la réauthentification." });
        }

        const currentHash = crypto.pbkdf2Sync(currentPassword, user.salt, 100000, 64, 'sha512').toString('hex');
        if (currentHash !== user.password_hash) {
            return res.status(401).json({ error: "Le mot de passe actuel est incorrect. Réauthentification échouée." });
        }

        db.get("SELECT value FROM security_config WHERE key = 'min_length'", (err, config) => {
            const minLength = config ? parseInt(config.value) : 8;
            if (newPassword.length < minLength) {
                return res.status(400).json({ error: `Le nouveau mot de passe doit contenir au moins ${minLength} caractères.` });
            }

            db.get("SELECT value FROM security_config WHERE key = 'password_history_limit'", (err, historyConfig) => {
                const historyLimit = historyConfig ? parseInt(historyConfig.value) : 3;

                const historyQuery = "SELECT password_hash FROM password_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?";
                db.all(historyQuery, [userId, historyLimit], (err, historyRows) => {
                    if (err) return res.status(500).json({ error: "Erreur lors de la vérification de l'historique." });

                    const newHash = crypto.pbkdf2Sync(newPassword, user.salt, 100000, 64, 'sha512').toString('hex');

                    const passwordIsOld = historyRows.some(row => row.password_hash === newHash);
                    if (passwordIsOld || newHash === user.password_hash) {
                        return res.status(400).json({ error: `Vous ne pouvez pas réutiliser l'un de vos ${historyLimit} derniers mots de passe.` });
                    }

                    db.serialize(() => {
                        db.run("INSERT INTO password_history (user_id, password_hash) VALUES (?, ?)", [userId, user.password_hash]);
                        db.run("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, userId]);
                        db.run("INSERT INTO security_logs (event) VALUES (?)", [`Changement de mot de passe réussi pour l'utilisateur : ${user.username}`]);

                        return res.json({ message: "Votre mot de passe a été modifié avec succès." });
                    });
                });
            });
        });
    });
};
