import { Router } from "express";
import { registerAdmin,loginAdmin,registerDoctor } from "../controllers/admin.controller.js";
import { Protectadmin } from "../middleware/admin.auth.js";

const router=Router();


// endpoints
router.post('/register',registerAdmin);
router.post('/login',loginAdmin);
router.post('/register/doctor',Protectadmin,registerDoctor)

export default router;