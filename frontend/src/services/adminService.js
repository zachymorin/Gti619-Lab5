const API_URL = "http://localhost:8080/api/admin";

export const fetchAllUsers = async () => {
	const response = await fetch(`${API_URL}/users`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Impossible de récupérer les utilisateurs.");
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
		throw new Error(errorData.error || "Impossible de créer l'utilisateur.");
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
