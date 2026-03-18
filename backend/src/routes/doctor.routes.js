import { Router } from "express";
import {loginDoctor,changePasswordDoctor } from "../controllers/doctor.controller.js";
import {protectDoctor} from '../middleware/doctor.auth.js'

const router=Router();


// endpoints
// router.post('/register',registerDoctor);
router.post('/login',loginDoctor);
router.post('/change/password',protectDoctor,changePasswordDoctor)
export default router;