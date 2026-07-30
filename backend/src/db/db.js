import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "../../database.db");
const schemaPath = path.resolve(__dirname, "../../database/schema.sql");
const seedPath = path.resolve(__dirname, "../../database/seed.sql");

export const db = new Database(dbPath);
console.log("Connecté à la BD SQLite.");

function initDatabase() {
    try {
        const schemaSql = fs.readFileSync(schemaPath, "utf8");
        const seedSql = fs.readFileSync(seedPath, "utf8");

        db.exec(schemaSql);
        console.log("BD créée selon schema.sql");

        db.exec(seedSql);
        console.log("Insertion de données réussie selon seed.sql");
        console.log("--- The application should be ready to go ---");
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la BD :", error.message);
    }
}

initDatabase();