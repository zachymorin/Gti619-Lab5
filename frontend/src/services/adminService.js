const API_URL = "http://localhost:8080/api/admin";

export const fetchAllUsers = async () => {
	const response = await fetch(`${API_URL}/users`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Impossible de récupérer les utilisateurs.");
	}

	return response.json();
};

export const createUser = async (username, password, role) => {
	const response = await fetch(`${API_URL}/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password, role }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Impossible de créer l'utilisateur.");
	}

	return response.json();
};

export const fetchSecurityConfig = async () => {
	const response = await fetch(`${API_URL}/security-config`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) throw new Error("Impossible de charger la configuration de sécurité.");
	return response.json();
};

export const updateSecurityConfig = async (config) => {
	const response = await fetch(`${API_URL}/security-config`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(config),
	});
	if (!response.ok) throw new Error("Impossible de sauvegarder la configuration.");
	return response.json();
};
