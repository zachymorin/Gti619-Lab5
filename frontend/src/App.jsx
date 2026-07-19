import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
// import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import Navigation from "./components/Navigation";

export default function App() {
    const [user, setUser] = useState(null);
    const [view, setView] = useState("login");

    const handleLogout = () => {
        setUser(null);
        setView("login");
    };

    return (
        <div className="app-container" style={{ fontFamily: "sans-serif", padding: "20px" }}>
            {user && <Navigation user={user} onLogout={handleLogout} setView={setView} />}

            <main className="content" style={{ marginTop: "20px" }}>
                {view === "login" && <LoginForm setUser={setUser} setView={setView} />}

                {/* {view === "forgot-password" && <ForgotPassword setView={setView} />} */}

                {view === "home" && user && <Dashboard user={user} />}
            </main>
        </div>
    );
}
