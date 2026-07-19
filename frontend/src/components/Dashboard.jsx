import React, { useState, useEffect } from "react";
import { fetchAllUsers, fetchSecurityConfig, createUser, updateSecurityConfig } from "../services/adminService";
import { searchResidentialClients, searchBusinessClients } from "../services/clientService";

function Dashboard({ user }) {
	const [currentSubView, setCurrentSubView] = useState("menu");
	const [searchQuery, setSearchQuery] = useState("");

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [newUsername, setNewUsername] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newRole, setNewRole] = useState("Préposé aux clients résidentiels");

	const [searchResults, setSearchResults] = useState([]);

	const [securityConfig, setSecurityConfig] = useState({
		max_attempts: "3",
		min_length: "8",
		password_history_limit: "3",
	});

	useEffect(() => {
		if (currentSubView === "user-list") {
			const loadUsers = async () => {
				try {
					setLoading(true);
					setError(null);
					const data = await fetchAllUsers();
					setUsers(data);
				} catch (err) {
					setError(err.message);
				} finally {
					setLoading(false);
				}
			};

			loadUsers();
		}

		if (currentSubView === "security-config") {
			const loadConfig = async () => {
				try {
					setLoading(true);
					setError(null);
					const data = await fetchSecurityConfig();
					setSecurityConfig(data);
				} catch (err) {
					setError(err.message);
				} finally {
					setLoading(false);
				}
			};
			loadConfig();
		}
		return () => {
			setSearchQuery("");
			setSearchResults([]);
		};
	}, [currentSubView]);

	const handleCreateUser = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError(null);

			const createdUser = await createUser(newUsername, newPassword, newRole);

			alert(`L'utilisateur ${newUsername} a été créé avec succès !`);

			setUsers((prevUsers) => [...prevUsers, createdUser]);

			setNewUsername("");
			setNewPassword("");
			setNewRole("Préposé aux clients résidentiels");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleSaveSecurityConfig = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError(null);

			await updateSecurityConfig(securityConfig);

			alert("Politiques de sécurité mises à jour avec succès ! 🛡️");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError(null);

			const data = await searchResidentialCustomers(searchQuery);
			setSearchResults(data);
		} catch (err) {
			setError(err.message);
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	};

	const handleSearchBusiness = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError(null);

			const data = await searchBusinessClients(searchQuery);
			setSearchResults(data);
		} catch (err) {
			setError(err.message);
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	};

	const renderDashboardContent = () => {
		switch (user.role) {
			case "Administrateur":
				switch (currentSubView) {
					case "user-list":
						return (
							<div>
								<button onClick={() => setCurrentSubView("menu")} style={backButtonStyle}>
									Retour au menu
								</button>
								<h3>Liste des Utilisateurs</h3>
								<p
									style={{
										color: "#6c757d",
										marginBottom: "15px",
									}}>
									Gestion des accès et rôles du personnel.
								</p>

								{error && (
									<p
										style={{
											color: "#dc3545",
											fontWeight: "bold",
										}}>
										Erreur : {error}
									</p>
								)}

								{loading ? (
									<p
										style={{
											color: "#007bff",
											fontStyle: "italic",
										}}>
										Chargement des utilisateurs en cours... ⏳
									</p>
								) : (
									<table
										style={{
											width: "100%",
											borderCollapse: "collapse",
											marginTop: "10px",
										}}>
										<thead>
											<tr
												style={{
													backgroundColor: "#f1f3f5",
													borderBottom: "2px solid #dee2e6",
													textAlign: "left",
												}}>
												<th style={tableHeaderStyle}>Identifiant</th>
												<th style={tableHeaderStyle}>Nom d&apos;utilisateur</th>
												<th style={tableHeaderStyle}>Rôle assigné</th>
											</tr>
										</thead>
										<tbody>
											{users.map((u) => (
												<tr
													key={u.id}
													style={{
														borderBottom: "1px solid #dee2e6",
													}}>
													<td style={tableCellStyle}>{u.id}</td>
													<td style={tableCellStyle}>
														<strong>{u.username}</strong>
													</td>
													<td style={tableCellStyle}>
														<span style={roleBadgeStyle(u.role)}>{u.role}</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
						);

					case "create-user":
						return (
							<div style={{ maxWidth: "400px" }}>
								<button onClick={() => setCurrentSubView("menu")} style={backButtonStyle}>
									Retour au menu
								</button>
								<h3>Créer un Nouvel Utilisateur</h3>

								<form
									onSubmit={handleCreateUser}
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "15px",
										marginTop: "15px",
									}}>
									<div>
										<label
											style={{
												display: "block",
												marginBottom: "5px",
											}}>
											Nom d&apos;utilisateur :
										</label>
										<input
											type="text"
											value={newUsername}
											onChange={(e) => setNewUsername(e.target.value)}
											style={inputStyle}
											required
										/>
									</div>

									<div>
										<label
											style={{
												display: "block",
												marginBottom: "5px",
											}}>
											Mot de passe :
										</label>
										<input
											type="password"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											style={inputStyle}
											required
										/>
									</div>

									<div>
										<label
											style={{
												display: "block",
												marginBottom: "5px",
											}}>
											Rôle système :
										</label>
										<select
											value={newRole}
											onChange={(e) => setNewRole(e.target.value)}
											style={inputStyle}>
											<option value="Préposé aux clients résidentiels">
												Préposé aux clients résidentiels
											</option>
											<option value="Préposé aux clients d'affaires">
												Préposé aux clients d&apos;affaires
											</option>
											<option value="Administrateur">Administrateur</option>
										</select>
									</div>

									<button type="submit" style={actionButtonStyle}>
										Créer le compte
									</button>
								</form>
							</div>
						);

					case "security-config":
						return (
							<div style={{ maxWidth: "450px" }}>
								<button onClick={() => setCurrentSubView("menu")} style={backButtonStyle}>
									Retour au menu
								</button>
								<h3>Politiques de Sécurité 🛡️</h3>
								<p
									style={{
										color: "#6c757d",
										marginBottom: "20px",
									}}>
									Ajustez les configurations de sécurité du système.
								</p>

								{error && (
									<p
										style={{
											color: "#dc3545",
											fontWeight: "bold",
										}}>
										Erreur : {error}
									</p>
								)}

								{loading ? (
									<p
										style={{
											color: "#007bff",
											fontStyle: "italic",
										}}>
										Chargement de la configuration...
									</p>
								) : (
									<form
										onSubmit={handleSaveSecurityConfig}
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "20px",
										}}>
										<div>
											<label
												style={{
													display: "block",
													marginBottom: "5px",
												}}>
												<strong>Tentatives de connexion maximales :</strong>
											</label>
											<input
												type="number"
												min="1"
												max="10"
												value={securityConfig.max_attempts}
												onChange={(e) =>
													setSecurityConfig({
														...securityConfig,
														max_attempts: e.target.value,
													})
												}
												style={inputStyle}
												required
											/>
										</div>

										<div>
											<label
												style={{
													display: "block",
													marginBottom: "5px",
												}}>
												<strong>Longueur minimale du mot de passe :</strong>
											</label>
											<input
												type="number"
												min="8"
												max="64"
												value={securityConfig.min_length}
												onChange={(e) =>
													setSecurityConfig({
														...securityConfig,
														min_length: e.target.value,
													})
												}
												style={inputStyle}
												required
											/>
										</div>

										<div>
											<label
												style={{
													display: "block",
													marginBottom: "5px",
												}}>
												<strong>Limite de l&apos;historique des mots de passe :</strong>
											</label>
											<input
												type="number"
												min="1"
												max="10"
												value={securityConfig.password_history_limit}
												onChange={(e) =>
													setSecurityConfig({
														...securityConfig,
														password_history_limit: e.target.value,
													})
												}
												style={inputStyle}
												required
											/>
											<small
												style={{
													display: "block",
													color: "#6c757d",
													marginTop: "5px",
												}}>
												Nombre de mots de passe uniques avant réutilisation.
											</small>
										</div>

										<button type="submit" style={actionButtonStyle}>
											Sauvegarder les politiques
										</button>
									</form>
								)}
							</div>
						);

					case "menu":
					default:
						return (
							<div>
								<h3>Panneau de Contrôle Global</h3>
								<div
									style={{
										display: "flex",
										gap: "20px",
										marginBottom: "20px",
									}}>
									<div style={cardStyle}>
										<strong>Utilisateurs enregistrés :</strong> {users.length || "--"}
									</div>
									<div style={cardStyle}>
										<strong>Alertes sécurité :</strong> 0 🔒
									</div>
								</div>
								<h4>Actions disponibles :</h4>
								<div
									style={{
										display: "flex",
										gap: "10px",
										flexDirection: "column",
										maxWidth: "300px",
									}}>
									<button onClick={() => setCurrentSubView("user-list")} style={actionButtonStyle}>
										Voir la liste des utilisateurs
									</button>
									<button onClick={() => setCurrentSubView("create-user")} style={actionButtonStyle}>
										Créer un nouvel utilisateur
									</button>
									<button
										onClick={() => setCurrentSubView("security-config")}
										style={actionButtonStyle}>
										Configurer la sécurité
									</button>
								</div>
							</div>
						);
				}

			case "Préposé aux clients résidentiels":
				return (
					<div>
						<h3>Espace Clients Résidentiels</h3>
						<p style={{ color: "#6c757d" }}>Rechercher et gérer les profils des particuliers.</p>

						<form
							onSubmit={handleSearch}
							style={{
								marginBottom: "20px",
								display: "flex",
								gap: "10px",
							}}>
							<input
								type="text"
								placeholder="Nom ou numéro de compte..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								style={{
									padding: "8px",
									width: "250px",
									borderRadius: "4px",
									border: "1px solid #ccc",
								}}
								required
							/>
							<button type="submit" style={{ ...actionButtonStyle, margin: 0 }}>
								Rechercher
							</button>
						</form>

						{error && <p style={{ color: "#dc3545" }}>{error}</p>}
						{loading && <p style={{ color: "#007bff" }}>Recherche en cours...</p>}

						{!loading && searchResults.length > 0 && (
							<div style={{ marginTop: "20px" }}>
								<h4>Résultats de la recherche ({searchResults.length}) :</h4>
								<ul
									style={{
										listStyleType: "none",
										padding: 0,
									}}>
									{searchResults.map((client) => (
										<li
											key={client.id}
											style={{
												padding: "10px",
												borderBottom: "1px solid #eee",
												backgroundColor: "#fdfdfd",
											}}>
											👤 <strong>{client.fullName}</strong> - Compte : {client.accountNumber} (
											{client.city})
										</li>
									))}
								</ul>
							</div>
						)}

						{!loading && searchQuery && searchResults.length === 0 && !error && (
							<p
								style={{
									color: "#6c757d",
									fontStyle: "italic",
								}}>
								Aucun client résidentiel trouvé pour {searchQuery}.
							</p>
						)}
					</div>
				);

			case "Préposé aux clients d'affaires":
				return (
					<div>
						<h3>Espace Clients d&apos;Affaires</h3>
						<p style={{ color: "#6c757d" }}>
							Gestion du portefeuille des entreprises et comptes commerciaux.
						</p>

						<form
							onSubmit={handleSearchBusiness}
							style={{
								marginBottom: "20px",
								display: "flex",
								gap: "10px",
							}}>
							<input
								type="text"
								placeholder="Nom de l'entreprise ou NEQ..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								style={{
									padding: "8px",
									width: "250px",
									borderRadius: "4px",
									border: "1px solid #ccc",
								}}
								required
							/>
							<button type="submit" style={{ ...actionButtonStyle, margin: 0 }}>
								Rechercher 🔍
							</button>
						</form>

						{error && <p style={{ color: "#dc3545" }}>{error}</p>}
						{loading && <p style={{ color: "#007bff" }}>Recherche commerciale en cours...</p>}

						{!loading && searchResults.length > 0 && (
							<div style={{ marginTop: "20px" }}>
								<h4>Entreprises trouvées ({searchResults.length}) :</h4>
								<ul
									style={{
										listStyleType: "none",
										padding: 0,
									}}>
									{searchResults.map((company) => (
										<li
											key={company.id}
											style={{
												padding: "10px",
												borderBottom: "1px solid #eee",
												backgroundColor: "#fdfdfd",
											}}>
											<strong>{company.companyName}</strong> - NEQ : {company.neq} (
											{company.industry})
										</li>
									))}
								</ul>
							</div>
						)}

						{!loading && searchQuery && searchResults.length === 0 && !error && (
							<p
								style={{
									color: "#6c757d",
									fontStyle: "italic",
								}}>
								Aucune entreprise trouvée pour {searchQuery}.
							</p>
						)}
					</div>
				);

			default:
				return <p>Rôle non reconnu ou accès restreint.</p>;
		}
	};

	return (
		<div
			style={{
				padding: "20px",
				border: "1px solid #ddd",
				borderRadius: "5px",
				backgroundColor: "#fff",
			}}>
			<h2>Tableau de bord de {user.username}</h2>
			<hr style={{ borderColor: "#eee", marginBottom: "20px" }} />
			{renderDashboardContent()}
		</div>
	);
}

const inputStyle = {
	width: "100%",
	padding: "8px 12px",
	borderRadius: "4px",
	border: "1px solid #ccc",
	fontSize: "14px",
	boxSizing: "border-box",
};

const actionButtonStyle = {
	backgroundColor: "#007bff",
	color: "#fff",
	border: "none",
	padding: "10px 15px",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "14px",
	fontWeight: "bold",
	marginTop: "5px",
};

const backButtonStyle = {
	backgroundColor: "#6c757d",
	color: "#fff",
	border: "none",
	padding: "6px 12px",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "13px",
	marginBottom: "15px",
};

const cardStyle = {
	padding: "15px 20px",
	border: "1px solid #dee2e6",
	borderRadius: "6px",
	backgroundColor: "#f8f9fa",
	flex: 1,
};

const tableHeaderStyle = {
	padding: "12px 8px",
	fontWeight: "bold",
	color: "#495057",
};

const tableCellStyle = {
	padding: "12px 8px",
	color: "#212529",
};

const roleBadgeStyle = (role) => {
	let bgColor = "#e2e3e5";
	let textColor = "#383d41";

	if (role === "Administrateur") {
		bgColor = "#f8d7da";
		textColor = "#721c24";
	} else if (role?.includes("résidentiels")) {
		bgColor = "#cce5ff";
		textColor = "#004085";
	} else if (role?.includes("affaires")) {
		bgColor = "#d4edda";
		textColor = "#155724";
	}

	return {
		padding: "4px 8px",
		borderRadius: "4px",
		fontSize: "12px",
		fontWeight: "bold",
		backgroundColor: bgColor,
		color: textColor,
	};
};

export default Dashboard;
