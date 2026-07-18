export const getSecurityConfig = async (req, res) => {
    res.json({ message: "Squelette: Récupération des paramètres de sécurité" });
};

export const updateSecurityConfig = async (req, res) => {
    res.json({ message: "Squelette: Modification des paramètres de sécurité" });
};

export const createUser = async (req, res) => {
    res.json({ message: "Squelette: Ajout d'un nouvel utilisateur et son rôle" });
};