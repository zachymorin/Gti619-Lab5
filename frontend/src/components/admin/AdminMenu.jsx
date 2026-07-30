import React from "react";

export function AdminMenu({ onNavigate }) {
    return (
        <div>
            <h3>Panneau de Contrôle Administrateur</h3>
            <div style={{ display: 'flex', gap: '15px', flexDirection: 'column', maxWidth: '320px', marginTop: '20px' }}>
                <button onClick={() => onNavigate('client-list')} style={actionButtonStyle}>
                    Liste des clients
                </button>
                <button onClick={() => onNavigate('user-list')} style={actionButtonStyle}>
                    Liste des utilisateurs
                </button>
                <button onClick={() => onNavigate('create-user')} style={actionButtonStyle}>
                    Créer un nouvel utilisateur
                </button>
                <button onClick={() => onNavigate('security-config')} style={actionButtonStyle}>
                    Configurer la sécurité
                </button>
            </div>
        </div>
    );
}

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
