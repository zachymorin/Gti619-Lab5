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