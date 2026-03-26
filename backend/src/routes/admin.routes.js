import { Router } from "express";
import {registerDoctor, deactivateDoctor, getAllDoctors, getAnalytics, reactivateDoctor, getAllUsers } from "../controllers/admin.controller.js";
import { Protectadmin } from "../middleware/admin.auth.js";
import {registerAdmin, loginAdmin} from '../controllers/auth/admin.auth.controller.js'


const router=Router();


// endpoints

// Admin authentication
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Doctor management (protected)
router.post('/doctors', Protectadmin, registerDoctor);
router.patch('/doctors/:id/deactivate', Protectadmin, deactivateDoctor);
router.get('/doctors',Protectadmin,getAllDoctors);
router.get('/analytics',Protectadmin,getAnalytics);


router.patch('/doctors/:id/reactivate', Protectadmin, reactivateDoctor);  
router.get('/users',Protectadmin, getAllUsers);         

export default router;