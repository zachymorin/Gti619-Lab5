// 🔌 URL absolue pointant directement vers votre serveur Express
const API_URL = 'http://localhost:8080/api'; 

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Une erreur est survenue lors de la connexion.');
  }

  return response.json();
};