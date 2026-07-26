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

export const createUser = async (username, password, passwordConfirm, roleId) => {
	const response = await fetch(`${API_URL}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ username, password, passwordConfirm, roleId }),
	});

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossible de récupérer la liste des utilisateurs.");
    }

    return response.json();
};

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

export const fetchSecurityConfig = async () => {
	const response = await fetch(`${API_URL}/config`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	});
	if (!response.ok) throw new Error("Impossible de charger la configuration de sécurité.");
	return response.json();
};

export const updateSecurityConfig = async (config) => {
	const response = await fetch(`${API_URL}/config`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(config),
		credentials: "include",
	});
	if (!response.ok) throw new Error("Impossible de sauvegarder la configuration.");
	return response.json();
};

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