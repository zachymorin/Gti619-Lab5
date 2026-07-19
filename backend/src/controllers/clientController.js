import { db } from "../db/db.js";

export const getResidentialClients = async (req, res) => {
	const query = "SELECT * FROM clients WHERE type = ?";

	db.all(query, ["residentiel"], (err, rows) => {
		if (err) {
			return res.status(500).json({
				error: "Erreur lors de la récupération des clients résidentiels.",
			});
		}
		return res.json(rows);
	});
};

export const getBusinessClients = async (req, res) => {
	const query = "SELECT * FROM clients WHERE type = ?";

	db.all(query, ["affaire"], (err, rows) => {
		if (err) {
			return res.status(500).json({
				error: "Erreur lors de la récupération des clients d'affaires.",
			});
		}
		return res.json(rows);
	});
};
