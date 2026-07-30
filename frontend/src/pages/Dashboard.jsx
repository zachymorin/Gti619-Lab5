import React, { useState } from "react";
import Navigation from "../components/generic/Navigation.jsx";
import AdminDashboard from "../components/admin/AdminDashboard.jsx";
import ResidentialDashboard from "../components/residential/ResidentialDashboard.jsx";
import BusinessDashboard from "../components/business/BusinessDashboard.jsx";
import ChangePasswordForm from "../components/generic/ChangePasswordForm.jsx";
import { changeOwnPassword } from "../services/authService.js";

function Dashboard({ user, onLogout }) {
    const [activeView, setActiveView] = useState("dashboard");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePasswordChange = async ({ currentPassword, newPassword, newPasswordConfirm }) => {
        try {
            setLoading(true);
            setError(null);
            
            await changeOwnPassword(currentPassword, newPassword, newPasswordConfirm);

            alert("Votre mot de passe a été modifié avec succès !");
            setActiveView("dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderMainContent = () => {
        if (activeView === "reset-password") {
            return (
                <ChangePasswordForm
                    onBack={() => setActiveView("dashboard")}
                    onSubmit={handlePasswordChange}
                    loading={loading}
                    error={error}
                />
            );
        }

        switch (Number(user?.roleId)) {
            case 1:
                return <AdminDashboard />;
            case 2:
                return <ResidentialDashboard />;
            case 3:
                return <BusinessDashboard />;
            default:
                return <p>Rôle non reconnu ou accès restreint.</p>;
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#fff" }}>
            <Navigation user={user} onLogout={onLogout} setView={setActiveView} />

            <h2>Tableau de bord de {user?.username}</h2>
            <hr style={{ borderColor: "#eee", marginBottom: "20px" }} />

            {renderMainContent()}
        </div>
    );
}

export default Dashboard;