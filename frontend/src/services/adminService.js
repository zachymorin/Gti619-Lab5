// 🔌 URL absolue pointant directement vers votre serveur Express
const API_URL = "http://localhost:8080/api";

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue lors de la connexion.");
    }

    return response.json();
};

/**
 * Récupère la liste globale de tous les utilisateurs (Admin seulement)
 */
export const fetchAllUsers = async () => {
    const response = await fetch(`${API_URL}/admin/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossible de récupérer la liste des utilisateurs.");
    }

    return response.json();
};

/**
 * Réinitialise le mot de passe d'un utilisateur
 */
export const resetUserPassword = async (userId, newPassword) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/reset-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossible de réinitialiser le mot de passe de l'utilisateur.");
    }

    return response.json();
};

/**
 * Récupère les configurations de sécurité (Admin seulement)
 */
export const fetchSecurityConfig = async () => {
    const response = await fetch(`${API_URL}/admin/config`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la récupération des configurations.");
    }

    return response.json();
};

/**
 * Met à jour les configurations de sécurité (Admin seulement)
 */
export const updateSecurityConfig = async (configPayload) => {
    const response = await fetch(`${API_URL}/admin/config`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(configPayload),
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour des configurations.");
    }

    return response.json();
};

/**
 * Création d'un utilisateur par un administrateur
 */
export const createUser = async (username, password, confirmPassword, roleId) => {
    const response = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confirmPassword, roleId }),
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création de l'utilisateur.");
    }

    return response.json();
};
