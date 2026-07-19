import React from "react";

function Navigation({ user, onLogout, setView }) {
	return (
		<nav
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "10px 20px",
				backgroundColor: "#f8f9fa",
				borderBottom: "1px solid #e9ecef",
				borderRadius: "5px",
			}}>
			<div style={{ display: "flex", gap: "15px" }}>
				<button onClick={() => setView("home")} style={buttonStyle}>
					Accueil
				</button>

				{user && user.roleId === 1 && (
					<button onClick={() => setView("admin-panel")} style={buttonStyle}>
						Panneau Admin
					</button>
				)}

				{user && user.roleId === 2 && (
					<button onClick={() => setView("residential-clients")} style={buttonStyle}>
						Comptes Résidentiels
					</button>
				)}

				{user && user.roleId === 3 && (
					<button onClick={() => setView("business-clients")} style={buttonStyle}>
						Comptes Affaires
					</button>
				)}
			</div>

			<div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
				<span style={{ fontSize: "14px", color: "#6c757d" }}>
					Connecté en tant que : <strong>{user.username}</strong> ({user.role})
				</span>
				<button
					onClick={onLogout}
					style={{
						...buttonStyle,
						backgroundColor: "#dc3545",
						color: "white",
					}}>
					Déconnexion
				</button>
			</div>
		</nav>
	);
}

const buttonStyle = {
	padding: "8px 12px",
	border: "1px solid #ced4da",
	borderRadius: "4px",
	backgroundColor: "white",
	cursor: "pointer",
	fontSize: "14px",
};

export default Navigation;
