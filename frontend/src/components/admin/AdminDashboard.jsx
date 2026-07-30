import React, { useState, useEffect } from "react";
import { fetchAllUsers, fetchSecurityConfig, createUser, updateSecurityConfig, resetUserPassword } from "../../services/adminService";
import { searchResidentialClients, searchBusinessClients } from "../../services/clientService";
import { ClientTable } from "./ClientTable";
import { UserManagement } from "./UserManagement";
import { CreateUserForm } from "./CreateUserForm";
import { SecurityConfigForm } from "./SecurityConfigForm";
import { AdminMenu } from "./AdminMenu";

function AdminDashboard() {
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
        if (currentSubView === 'user-list') {
            fetchAllUsers().then(setUsers).catch(e => setError(e.message));
        } else if (currentSubView === 'client-list') {
            Promise.all([searchResidentialClients(''), searchBusinessClients('')])
                .then(([res, bus]) => setClients([...res, ...bus]))
                .catch(e => setError(e.message));
        } else if (currentSubView === 'security-config') {
            fetchSecurityConfig().then(data => {
                if (Array.isArray(data)) {
                    setSecurityConfig(data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {}));
                } else setSecurityConfig(data);
            }).catch(e => setError(e.message));
        }
    }, [currentSubView]);

    const handleBack = () => setCurrentSubView('menu');

    switch (currentSubView) {
        case 'client-list':
            return <ClientTable clients={clients} loading={loading} error={error} onBack={handleBack} />;
        case 'user-list':
            return <UserManagement users={users} loading={loading} error={error} onBack={handleBack} onResetPassword={resetUserPassword} />;
        case 'create-user':
            return <CreateUserForm newUsername={newUsername} setNewUsername={setNewUsername} newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} newRoleId={newRoleId} setNewRoleId={setNewRoleId} onSubmit={createUser} loading={loading} error={error} onBack={handleBack} />;
        case 'security-config':
            return <SecurityConfigForm securityConfig={securityConfig} setSecurityConfig={setSecurityConfig} onSubmit={updateSecurityConfig} loading={loading} error={error} onBack={handleBack} />;
        default:
            return <AdminMenu onNavigate={setCurrentSubView} />;
    }
}

export default AdminDashboard;