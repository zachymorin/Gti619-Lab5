import express from "express";
import { login, logout } from "../controllers/authController.js";
import { getResidentialClients, getBusinessClients } from "../controllers/clientController.js";
import { getSecurityConfig, updateSecurityConfig, createUser, getAllUsers, resetUserPassword } from "../controllers/adminController.js";
import { sessionAuth, requireRole } from "../middlewares/authMiddleware.js";

export const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/logout", logout);

router.get(
	"/clients/residential",
	sessionAuth,
	requireRole([1, 2]),
	getResidentialClients,
);
router.get(
	"/clients/business",
	sessionAuth,
	requireRole([1, 3]),
	getBusinessClients,
);

router.get("/admin/config", sessionAuth, requireRole([1]), getSecurityConfig);
router.post("/admin/config", sessionAuth, requireRole([1]), updateSecurityConfig);
router.post("/admin/users", sessionAuth, requireRole([1]), createUser);
router.get("/admin/users", sessionAuth, requireRole([1]), getAllUsers);
router.put("/admin/users/:id/reset-password", sessionAuth, requireRole([1]), resetUserPassword);
