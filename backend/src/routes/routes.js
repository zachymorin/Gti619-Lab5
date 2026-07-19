import express from "express";
import { login, logout, changePassword } from "../controllers/authController.js";
import { getResidentialClients, getBusinessClients } from "../controllers/clientController.js";
import { getSecurityConfig, updateSecurityConfig, createUser } from "../controllers/adminController.js";
import { sessionAuth, requireRole } from "../middlewares/authMiddleware.js";

export const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post("/auth/change-password", sessionAuth, changePassword);

router.get(
	"/clients/residential",
	sessionAuth,
	requireRole(["Administrateur", "Préposé aux clients résidentiels"]),
	getResidentialClients,
);
router.get(
	"/clients/business",
	sessionAuth,
	requireRole(["Administrateur", "Préposé aux clients d'affaire"]),
	getBusinessClients,
);

router.get("/admin/config", sessionAuth, requireRole(["Administrateur"]), getSecurityConfig);
router.post("/admin/config", sessionAuth, requireRole(["Administrateur"]), updateSecurityConfig);
router.post("/admin/users", sessionAuth, requireRole(["Administrateur"]), createUser);
