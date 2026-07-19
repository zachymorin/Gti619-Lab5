export const activeSessions = new Map();

export const sessionAuth = (req, res, next) => {
	const sessionId = req.cookies.sessionId;
	console.log("SessionId = " + sessionId)
	console.log("Raw Cookie Header:", req.headers.cookie);
	console.log("Parsed Cookies:", req.cookies);
	activeSessions.forEach((value, key) => {
  console.log(key + ' = ' + value);
});
	if (!sessionId || !activeSessions.has(sessionId)) {
			console.log("User unauthorized")

		return res.status(401).json({
			error: "Accès refusé. Session inexistante ou expirée. Veuillez vous connecter.",
		});
	}

	req.user = activeSessions.get(sessionId);

	next();
};

export const requireRole = (allowedRoles) => {
	return (req, res, next) => {
		if (!req.user || !req.user.roleId) {
			console.log("User unauthorized")
			return res.status(401).json({ error: "Non authentifié." });
		}

		if (!allowedRoles.includes(req.user.roleId)) {
			return res.status(403).json({
				error: `Accès interdit. Votre rôle '${req.user.roleId}' ne possède pas les permissions requises.`,
			});
		}

		next();
	};
};
