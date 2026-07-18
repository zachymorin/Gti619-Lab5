export const activeSessions = new Map();

export const sessionAuth = (req, res, next) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId || !activeSessions.has(sessionId)) {
        return res.status(401).json({ 
            error: "Accès refusé. Session inexistante ou expirée. Veuillez vous connecter." 
        });
    }

    req.user = activeSessions.get(sessionId);
    
    next();
};

export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: "Non authentifié." });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Accès interdit. Votre rôle '${req.user.role}' ne possède pas les permissions requises.` 
            });
        }

        next();
    };
};