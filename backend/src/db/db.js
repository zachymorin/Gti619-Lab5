import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../database.db');
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
const seedPath = path.resolve(__dirname, '../../database/seed.sql');

const sqlite = sqlite3.verbose();

export const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error("Erreur lors de l'ouverture de SQLite :", err.message);
    } else {
        console.log("Connecté à la BD SQLite.");
        initDatabase();
    }
});

function initDatabase() {
    try {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        db.serialize(() => {
            db.exec(schemaSql, (err) => {
                if (err) {
                    console.error("Erreur lors de l'exécution de schema.sql :", err.message);
                    return;
                } 
                console.log("BD créée selon schema.sql");

                db.exec(seedSql, (err) => {
                    if (err) {
                        console.error("Erreur lors de l'exécution de seed.sql :", err.message);
                    } else {
                        console.log("Insertion de données réussie selon seed.sql");
                        console.log("--- The application should be ready to go ---");
                    }
                });
            });
        });

    } catch (error) {
        console.error("Impossible de lire les fichiers SQL. Vérifiez les paths :", error.message);
    }
}