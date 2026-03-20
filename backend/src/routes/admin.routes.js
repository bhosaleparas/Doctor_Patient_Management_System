import { Router } from "express";
import {registerDoctor,deactivateDoctor } from "../controllers/admin.controller.js";
import { Protectadmin } from "../middleware/admin.auth.js";
import {registerAdmin,loginAdmin} from '../controllers/auth/admin.auth.controller.js'


const router=Router();


// endpoints
router.post('/register',registerAdmin);
router.post('/login',loginAdmin);
router.post('/register/doctor',Protectadmin,registerDoctor)
router.post('/deactivate_dcotor/:id',Protectadmin,deactivateDoctor)

export default router;