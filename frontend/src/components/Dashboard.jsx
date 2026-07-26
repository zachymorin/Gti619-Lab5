import React, { useState, useEffect } from "react";
import { 
    fetchAllUsers, 
    fetchSecurityConfig, 
    createUser, 
    updateSecurityConfig, 
    resetUserPassword 
} from "../services/adminService";
import { searchResidentialClients, searchBusinessClients } from "../services/clientService";

function Dashboard({ user }) {
    const [currentSubView, setCurrentSubView] = useState('menu');

    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newRoleId, setNewRoleId] = useState(2);

    const [securityConfig, setSecurityConfig] = useState({
        max_attempts: "3",
        min_length: "8",
        password_history_limit: "3",
    });

    useEffect(() => {
        // --- ADMIN: Chargement des utilisateurs du système ---
        if (user.roleId === 1 && currentSubView === 'user-list') {
            const loadUsers = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const dataUsers = await fetchAllUsers();
                    setUsers(dataUsers);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            loadUsers();
        }

        // --- ADMIN: Chargement de TOUS les clients (Résidentiels + Affaires) ---
        if (user.roleId === 1 && currentSubView === 'client-list') {
            const loadAllClients = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const [resClients, busClients] = await Promise.all([
                        searchResidentialClients(''),
                        searchBusinessClients('')
                    ]);
                    setClients([...resClients, ...busClients]);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            loadAllClients();
        }

        // --- ADMIN: Chargement des politiques de sécurité ---
        if (user.roleId === 1 && currentSubView === 'security-config') {
            const loadConfig = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await fetchSecurityConfig();
                    if (Array.isArray(data)) {
                        const configObject = data.reduce((acc, item) => {
                            acc[item.key] = item.value;
                            return acc;
                        }, {});
                        setSecurityConfig(configObject);
                    } else {
                        setSecurityConfig(data);
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            loadConfig();
        }

        // --- PRÉPOSÉ RÉSIDENTIEL (Role 2) ---
        if (user.roleId === 2) {
            const loadResidentialClients = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await searchResidentialClients('');
                    setClients(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            loadResidentialClients();
        }

        // --- PRÉPOSÉ AFFAIRES (Role 3) ---
        if (user.roleId === 3) {
            const loadBusinessClients = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await searchBusinessClients('');
                    setClients(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            loadBusinessClients();
        }
    }, [currentSubView, user.roleId]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const createdUser = await createUser(newUsername, newPassword, confirmPassword, newRoleId);
            alert(`L'utilisateur ${newUsername} a été créé avec succès !`);
            setUsers((prev) => [...prev, createdUser]);
            setNewUsername('');
            setNewPassword('');
            setConfirmPassword('');
            setNewRoleId(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (targetUser) => {
        const newPass = prompt(`Entrez le nouveau mot de passe pour l'utilisateur "${targetUser.username}" :`);
        if (!newPass) return;

        try {
            setLoading(true);
            setError(null);
            await resetUserPassword(targetUser.id, newPass);
            alert(`Le mot de passe de ${targetUser.username} a été réinitialisé avec succès !`);
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

            const payload = Object.keys(securityConfig).map((key) => ({
                key: key,
                value: securityConfig[key],
            }));

            await updateSecurityConfig(payload);
            alert('Politiques de sécurité mises à jour avec succès ! 🛡️');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderDashboardContent = () => {
        switch (user.roleId) {
            case 1:
                switch (currentSubView) {
                    case 'client-list':
                        return (
                            <div>
                                <button onClick={() => setCurrentSubView('menu')} style={backButtonStyle}>
                                    ← Retour au menu
                                </button>
                                <h3>Liste des Clients</h3>
                                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                                    Base de données consolidée des clients résidentiels et d'affaires.
                                </p>

                                {error && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>Erreur : {error}</p>}

                                {loading ? (
                                    <p style={{ color: '#007bff' }}>Chargement des clients... ⏳</p>
                                ) : (
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={tableHeaderRowStyle}>
                                                <th style={tableHeaderStyle}>ID Client</th>
                                                <th style={tableHeaderStyle}>Nom / Raison Sociale</th>
                                                <th style={tableHeaderStyle}>Type de Client</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clients.map((c) => (
                                                <tr key={c.id} style={tableRowStyle}>
                                                    <td style={tableCellStyle}>{c.id}</td>
                                                    <td style={tableCellStyle}><strong>{c.name}</strong></td>
                                                    <td style={tableCellStyle}>
                                                        <span style={clientBadgeStyle(c.type)}>{c.type}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        );

                    case 'user-list':
                        return (
                            <div>
                                <button onClick={() => setCurrentSubView('menu')} style={backButtonStyle}>
                                    ← Retour au menu
                                </button>
                                <h3>Gestion des Utilisateurs du Système</h3>
                                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                                    Comptes d'accès internes, réinitialisation de mot de passe et rôles.
                                </p>

                                {error && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>Erreur : {error}</p>}

                                {loading ? (
                                    <p style={{ color: '#007bff' }}>Chargement des utilisateurs... ⏳</p>
                                ) : (
                                    <table style={tableStyle}>
                                        <thead>
                                            <tr style={tableHeaderRowStyle}>
                                                <th style={tableHeaderStyle}>ID</th>
                                                <th style={tableHeaderStyle}>Nom d'utilisateur</th>
                                                <th style={tableHeaderStyle}>Rôle</th>
                                                <th style={tableHeaderStyle}>Statut Compte</th>
                                                <th style={tableHeaderStyle}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u.id} style={tableRowStyle}>
                                                    <td style={tableCellStyle}>{u.id}</td>
                                                    <td style={tableCellStyle}><strong>{u.username}</strong></td>
                                                    <td style={tableCellStyle}>
                                                        <span style={roleBadgeStyle(u.roleId)}>{getRoleLabel(u.roleId)}</span>
                                                    </td>
                                                    <td style={tableCellStyle}>
                                                        {u.is_locked ? (
                                                            <span style={{ color: '#dc3545', fontWeight: 'bold' }}>🔒 Verrouillé</span>
                                                        ) : (
                                                            <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Actif</span>
                                                        )}
                                                    </td>
                                                    <td style={tableCellStyle}>
                                                        <button 
                                                            onClick={() => handleResetPassword(u)} 
                                                            style={resetButtonStyle}
                                                            disabled={loading}
                                                        >
                                                            Réinitialiser mot de passe
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        );

                    case 'create-user':
                        return (
                            <div style={{ maxWidth: '400px' }}>
                                <button onClick={() => setCurrentSubView('menu')} style={backButtonStyle}>
                                    ← Retour au menu
                                </button>
                                <h3>Créer un Nouvel Utilisateur</h3>

                                {error && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>Erreur : {error}</p>}

                                <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>Nom d'utilisateur :</label>
                                        <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} style={inputStyle} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>Mot de passe :</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>Confirmer le mot de passe :</label>
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>Rôle système :</label>
                                        <select value={newRoleId} onChange={(e) => setNewRoleId(parseInt(e.target.value))} style={inputStyle}>
                                            <option value={2}>Préposé aux clients résidentiels</option>
                                            <option value={3}>Préposé aux clients d'affaires</option>
                                            <option value={1}>Administrateur</option>
                                        </select>
                                    </div>
                                    <button type="submit" style={actionButtonStyle} disabled={loading}>
                                        {loading ? 'Création...' : 'Créer le compte'}
                                    </button>
                                </form>
                            </div>
                        );

                    case 'security-config':
                        return (
                            <div style={{ maxWidth: '450px' }}>
                                <button onClick={() => setCurrentSubView('menu')} style={backButtonStyle}>
                                    ← Retour au menu
                                </button>
                                <h3>Politiques de Sécurité 🛡️</h3>
                                {error && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>Erreur : {error}</p>}

                                {loading ? (
                                    <p style={{ color: '#007bff' }}>Chargement de la configuration...</p>
                                ) : (
                                    <form onSubmit={handleSaveSecurityConfig} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                                <strong>Tentatives de connexion maximales :</strong>
                                            </label>
                                            <input type="number" min="1" max="10" value={securityConfig.max_attempts} onChange={(e) => setSecurityConfig({ ...securityConfig, max_attempts: e.target.value })} style={inputStyle} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                                <strong>Longueur minimale du mot de passe :</strong>
                                            </label>
                                            <input type="number" min="8" max="64" value={securityConfig.min_length} onChange={(e) => setSecurityConfig({ ...securityConfig, min_length: e.target.value })} style={inputStyle} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                                <strong>Limite d'historique des mots de passe :</strong>
                                            </label>
                                            <input type="number" min="1" max="10" value={securityConfig.password_history_limit} onChange={(e) => setSecurityConfig({ ...securityConfig, password_history_limit: e.target.value })} style={inputStyle} required />
                                        </div>
                                        <button type="submit" style={actionButtonStyle}>Sauvegarder les politiques</button>
                                    </form>
                                )}
                            </div>
                        );

                    case 'menu':
                    default:
                        return (
                            <div>
                                <h3>Panneau de Contrôle Administrateur</h3>
                                <div style={{ display: 'flex', gap: '15px', flexDirection: 'column', maxWidth: '320px', marginTop: '20px' }}>
                                    <button onClick={() => setCurrentSubView('client-list')} style={actionButtonStyle}>
                                        📋 Consulter la liste des clients
                                    </button>
                                    <button onClick={() => setCurrentSubView('user-list')} style={actionButtonStyle}>
                                        👥 Consulter la liste des utilisateurs
                                    </button>
                                    <button onClick={() => setCurrentSubView('create-user')} style={actionButtonStyle}>
                                        ➕ Créer un nouvel utilisateur
                                    </button>
                                    <button onClick={() => setCurrentSubView('security-config')} style={actionButtonStyle}>
                                        🛡️ Configurer la sécurité
                                    </button>
                                </div>
                            </div>
                        );
                }

            case 2:
                return (
                    <div>
                        <h3>Espace Clients Résidentiels</h3>
                        {error && <p style={{ color: '#dc3545' }}>Erreur : {error}</p>}
                        {loading ? (
                            <p style={{ color: '#007bff' }}>Chargement des clients... ⏳</p>
                        ) : (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRowStyle}>
                                        <th style={tableHeaderStyle}>ID Client</th>
                                        <th style={tableHeaderStyle}>Nom Complet</th>
                                        <th style={tableHeaderStyle}>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((client) => (
                                        <tr key={client.id} style={tableRowStyle}>
                                            <td style={tableCellStyle}>{client.id}</td>
                                            <td style={tableCellStyle}><strong>{client.name}</strong></td>
                                            <td style={tableCellStyle}>
                                                <span style={clientBadgeStyle(client.type)}>{client.type}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h3>Espace Clients d'Affaires</h3>
                        {error && <p style={{ color: '#dc3545' }}>Erreur : {error}</p>}
                        {loading ? (
                            <p style={{ color: '#007bff' }}>Chargement des comptes commerciaux... ⏳</p>
                        ) : (
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={tableHeaderRowStyle}>
                                        <th style={tableHeaderStyle}>ID Client</th>
                                        <th style={tableHeaderStyle}>Raison Sociale</th>
                                        <th style={tableHeaderStyle}>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((company) => (
                                        <tr key={company.id} style={tableRowStyle}>
                                            <td style={tableCellStyle}>{company.id}</td>
                                            <td style={tableCellStyle}><strong>{company.name}</strong></td>
                                            <td style={tableCellStyle}>
                                                <span style={clientBadgeStyle(company.type)}>{company.type}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );

            default:
                return <p>Rôle non reconnu ou accès restreint.</p>;
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#fff' }}>
            <h2>Tableau de bord de {user.username}</h2>
            <hr style={{ borderColor: '#eee', marginBottom: '20px' }} />
            {renderDashboardContent()}
        </div>
    );
}

// ---- Utilitaires & Styles ----
const getRoleLabel = (roleId) => {
    switch (Number(roleId)) {
        case 1: return "Administrateur";
        case 2: return "Préposé Résidentiel";
        case 3: return "Préposé Affaires";
        default: return "Inconnu";
    }
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const tableHeaderRowStyle = { backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6', textAlign: 'left' };
const tableRowStyle = { borderBottom: '1px solid #dee2e6' };
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' };

const actionButtonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'left'
};

const resetButtonStyle = {
    backgroundColor: '#ffc107',
    color: '#212529',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold'
};

const backButtonStyle = {
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    marginBottom: '15px'
};

const tableHeaderStyle = { padding: '12px 8px', fontWeight: 'bold', color: '#495057' };
const tableCellStyle = { padding: '12px 8px', color: '#212529' };

const roleBadgeStyle = (roleId) => {
    let bgColor = '#e2e3e5';
    let textColor = '#383d41';
    if (Number(roleId) === 1) { bgColor = '#f8d7da'; textColor = '#721c24'; }
    else if (Number(roleId) === 2) { bgColor = '#cce5ff'; textColor = '#004085'; }
    else if (Number(roleId) === 3) { bgColor = '#d4edda'; textColor = '#155724'; }

    return {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: bgColor,
        color: textColor
    };
};

const clientBadgeStyle = (type) => {
    const isResidentiel = type === 'residentiel';
    return {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: isResidentiel ? '#e3f2fd' : '#fff3e0',
        color: isResidentiel ? '#0d47a1' : '#e65100',
        textTransform: 'capitalize'
    };
};

export default Dashboard;