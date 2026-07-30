import React, { useState, useEffect } from "react";
import { searchBusinessClients } from "../../services/clientService";
import { GenericClientList } from "../generic/GenericClientList";

function BusinessDashboard() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        searchBusinessClients('')
            .then(setClients)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <GenericClientList 
            title="Espace Clients d'Affaires"
            clients={clients}
            loading={loading}
            error={error}
            isBusiness={true}
        />
    );
}

export default BusinessDashboard;