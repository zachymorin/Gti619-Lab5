import React from "react";
import AdminDashboard from "../components/admin/AdminDashboard";
import ResidentialDashboard from "../components/residential/ResidentialDashboard";
import BusinessDashboard from "../components/business/BusinessDashboard";

function Dashboard({ user }) {
    const renderRoleContent = () => {
        switch (user?.roleId) {
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
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#fff' }}>
            <h2>Tableau de bord de {user?.username}</h2>
            <hr style={{ borderColor: '#eee', marginBottom: '20px' }} />
            {renderRoleContent()}
        </div>
    );
}

export default Dashboard;