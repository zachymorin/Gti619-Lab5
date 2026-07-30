import React from "react";

export function GenericClientList({ title, clients, loading, error, isBusiness = false }) {
    return (
        <div>
            <h3>{title}</h3>
            {error && <p style={{ color: '#dc3545' }}>Erreur : {error}</p>}
            {loading ? (
                <p style={{ color: '#007bff' }}>Chargement...</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr style={tableHeaderRowStyle}>
                            <th style={tableHeaderStyle}>ID Client</th>
                            <th style={tableHeaderStyle}>{isBusiness ? "Raison Sociale" : "Nom Complet"}</th>
                            <th style={tableHeaderStyle}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((c) => (
                            <tr key={c.id} style={tableRowStyle}>
                                <td style={tableCellStyle}>{c.id}</td>
                                <td style={tableCellStyle}><strong>{c.name}</strong></td>
                                <td style={tableCellStyle}>
                                    <span style={clientBadgeStyle(c.type, isBusiness)}>{c.type}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
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