const API_URL = "http://localhost:8080/api/clients";

export const searchResidentialClients = async (query) => {
	const response = await fetch(`${API_URL}/residential?search=${encodeURIComponent(query)}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Impossible de charger les clients.");
	}

	return response.json();
};

export const searchBusinessClients = async (query) => {
	const response = await fetch(`${API_URL}/business?search=${encodeURIComponent(query)}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Impossible de charger les clients d'affaires.");
	}
	return response.json();
};
