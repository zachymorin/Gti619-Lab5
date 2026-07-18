export const getResidentialClients = async (req, res) => {
    res.json({ message: "Squelette: Liste des clients résidentiels" });
};

export const getBusinessClients = async (req, res) => {
    res.json({ message: "Squelette: Liste des clients d'affaires" });
};