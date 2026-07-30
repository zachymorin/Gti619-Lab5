import React, { useState } from "react";

function ChangePasswordForm({ onBack, onSubmit, loading, error }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError(null);

        if (newPassword !== confirmPassword) {
            setLocalError("Le nouveau mot de passe et la confirmation ne correspondent pas.");
            return;
        }

        onSubmit({ currentPassword, newPassword, newPasswordConfirm: confirmPassword });
    };

    const activeError = localError || error;

    return (
        <div style={{ maxWidth: "400px" }}>
            <button onClick={onBack} style={backButtonStyle}>
                ← Retour au tableau de bord
            </button>
            <h3>Réinitialiser le mot de passe 🔑</h3>

            {activeError && (
                <p style={{ color: "#dc3545", fontWeight: "bold" }}>Erreur : {activeError}</p>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Mot de passe actuel :</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Nouveau mot de passe :</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Confirmer le nouveau mot de passe :</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <button type="submit" style={actionButtonStyle} disabled={loading}>
                    {loading ? "Mise à jour..." : "Modifier le mot de passe"}
                </button>
            </form>
        </div>
    );
}

const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' };
const backButtonStyle = { backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', marginBottom: '15px' };
const actionButtonStyle = { backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' };

export default ChangePasswordForm;