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
 * Permet à l'utilisateur connecté de modifier son propre mot de passe
 */
export const changeOwnPassword = async (currentPassword, newPassword, newPasswordConfirm) => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword, newPasswordConfirm }),
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Impossible de modifier le mot de passe.");
    }

    return response.json();
};

export const logoutUser = async () => {
	const response = await fetch(`${API_URL}/auth/logout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Une erreur est survenue lors de la déconnexion.");
	}

	return response.json();
};