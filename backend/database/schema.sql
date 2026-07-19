-- 1. Table des utilisateurs (avec gestion du statut de blocage)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    roleId INTEGER, -- 'Administrateur', 'Préposé aux clients résidentiels', 'Préposé aux clients d\'affaire'
    failed_attempts INTEGER DEFAULT 0,
    is_locked INTEGER DEFAULT 0
);

-- 2. Table des clients (résidentiels et d'affaires)
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('residentiel', 'affaire'))
);

-- 3. Table de configuration globale des politiques de sécurité
CREATE TABLE IF NOT EXISTS security_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- 4. Historique des mots de passe pour empêcher la réutilisation
CREATE TABLE IF NOT EXISTS password_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- 5. Journalisation des événements de sécurité (Logs)
CREATE TABLE IF NOT EXISTS security_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);