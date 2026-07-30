import React, { useState, useEffect } from "react";
import { searchResidentialClients } from "../../services/clientService";
import { GenericClientList } from "../generic/GenericClientList";

function ResidentialDashboard() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        searchResidentialClients('')
            .then(setClients)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <GenericClientList 
            title="Espace Clients Résidentiels"
            clients={clients}
            loading={loading}
            error={error}
            isBusiness={false}
        />
    );
}

export default ResidentialDashboard;