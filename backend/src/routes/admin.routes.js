import { Router } from "express";
import {registerDoctor,deactivateDoctor } from "../controllers/admin.controller.js";
import { Protectadmin } from "../middleware/admin.auth.js";
import {registerAdmin,loginAdmin} from '../controllers/auth/admin.auth.controller.js'


const router=Router();


// endpoints

// Admin authentication
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Doctor management (protected)
router.post('/doctors', Protectadmin, registerDoctor);
router.patch('/doctors/:id/deactivate', Protectadmin, deactivateDoctor);

export default router;