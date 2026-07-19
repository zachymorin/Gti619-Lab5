import React, { useState } from "react";
import { loginUser } from "../services/authService";

function LoginForm({ setUser, setView }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const data = await loginUser(username, password);
			setError("");
			setUser(data);
			setView("home");
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div
			style={{
				maxWidth: "400px",
				margin: "50px auto",
				padding: "20px",
				border: "1px solid #ccc",
				borderRadius: "5px",
			}}>
			<h2>Connexion</h2>

			{error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}

			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "10px" }}>
					<label htmlFor="username">Nom utilisateur :</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						style={{
							width: "100%",
							padding: "8px",
							marginTop: "5px",
						}}
						required
					/>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label htmlFor="password">Mot de passe :</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						style={{
							width: "100%",
							padding: "8px",
							marginTop: "5px",
						}}
						required
					/>
				</div>

				<button
					type="submit"
					style={{
						width: "100%",
						padding: "10px",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "3px",
						cursor: "pointer",
					}}>
					Se connecter
				</button>
			</form>

			<div style={{ marginTop: "15px", textAlign: "center" }}>
				<button
					onClick={() => setView("forgot-password")}
					style={{
						background: "none",
						border: "none",
						color: "#007bff",
						textDecoration: "underline",
						cursor: "pointer",
					}}>
					Mot de passe oublié ?
				</button>
			</div>
		</div>
	);
}

export default LoginForm;
