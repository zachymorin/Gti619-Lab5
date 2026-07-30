import { db } from "../db/db.js";

export const getResidentialClients = async (req, res) => {
    try {
        const query = "SELECT * FROM clients WHERE type = ?";
        const rows = db.prepare(query).all("residentiel");
        return res.json(rows);
    } catch (err) {
        console.error("❌ Erreur getResidentialClients :", err.message);
        return res.status(500).json({
            error: "Erreur lors de la récupération des clients résidentiels.",
        });
    }
};

export const getBusinessClients = async (req, res) => {
    try {
        const query = "SELECT * FROM clients WHERE type = ?";
        const rows = db.prepare(query).all("affaire");
        return res.json(rows);
    } catch (err) {
        console.error("❌ Erreur getBusinessClients :", err.message);
        return res.status(500).json({
            error: "Erreur lors de la récupération des clients d'affaires.",
        });
    }
};