import { Router } from "express";
import { registerAdmin,loginAdmin,registerDoctor } from "../controllers/admin.controller.js";
import { checkToken } from "../middleware/checktoken.js";

const router=Router();


// endpoints
router.post('/register',registerAdmin);
router.post('/login',loginAdmin);
router.post('/register/doctor',checkToken,registerDoctor)

export default router;