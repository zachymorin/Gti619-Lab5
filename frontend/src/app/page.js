import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import ForgotPassword from "../components/ForgotPassword";
import Dashboard from "../components/Dashboard";
import Navigation from "../components/generic/Navigation";
import { logoutUser } from "../services/authService";

export default function Home() {
	const [user, setUser] = useState(null);
	const [view, setView] = useState("login");

	const handleLogout = async () => {
		try {
			await logoutUser();
		} catch (err) {
			console.error("Erreur lors de la déconnexion :", err.message);
		} finally {
			setUser(null);
			setView("login");
		}
	};

	return (
		<div className="app-container" style={{ fontFamily: "sans-serif", padding: "20px" }}>
			{user && <Navigation user={user} onLogout={handleLogout} setView={setView} />}

			<main className="content" style={{ marginTop: "20px" }}>
				{view === "login" && <LoginForm setUser={setUser} setView={setView} />}

				{view === "forgot-password" && <ForgotPassword setView={setView} />}

				{view === "home" && user && <Dashboard user={user} />}
			</main>
		</div>
	);
}