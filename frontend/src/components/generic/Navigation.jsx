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
                marginBottom: "20px"
            }}>
            <div style={{ display: "flex", gap: "15px" }}>
                <button onClick={() => setView("dashboard")} style={buttonStyle}>
                    Accueil
                </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span style={{ fontSize: "14px", color: "#6c757d" }}>
                    Connecté en tant que : <strong>{user?.username}</strong> ({getRoleLabel(user?.roleId)})
                </span>
                
                <button
                    onClick={() => setView("reset-password")}
                    style={{
                        ...buttonStyle,
                        backgroundColor: "#ffc107",
                        color: "#212529",
                        fontWeight: "bold"
                    }}>
                    Changer mot de passe
                </button>

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

const getRoleLabel = (roleId) => {
    switch (Number(roleId)) {
        case 1: return "Administrateur";
        case 2: return "Préposé Résidentiel";
        case 3: return "Préposé Affaires";
        default: return "Utilisateur";
    }
};

const buttonStyle = {
    padding: "8px 12px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "14px",
};

export default Navigation;