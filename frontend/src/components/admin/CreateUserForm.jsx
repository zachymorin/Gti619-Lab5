import React from "react";

export function CreateUserForm({ 
    newUsername, setNewUsername, 
    newPassword, setNewPassword, 
    confirmPassword, setConfirmPassword, 
    newRoleId, setNewRoleId, 
    onSubmit, loading, error, onBack 
}) {
    return (
        <div style={{ maxWidth: '400px' }}>
            <button onClick={onBack} style={backButtonStyle}>← Retour au menu</button>
            <h3>Créer un Nouvel Utilisateur</h3>

            {error && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>Erreur : {error}</p>}

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
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
}



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