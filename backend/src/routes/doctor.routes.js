import { Router } from "express";
import {changePasswordDoctor } from "../controllers/doctor.controller.js";
import {protectDoctor} from '../middleware/doctor.auth.js'
import {loginDoctor} from '../controllers/auth/doctor.auth.controller.js'
import { setAvailability,getDoctorSlots } from "../controllers/slot.controller.js";


const router=Router();


// endpoints
router.post('/login',loginDoctor);
router.post('/change/password',protectDoctor,changePasswordDoctor)
router.post('/availability', protectDoctor, setAvailability);
router.get('/slots', protectDoctor, getDoctorSlots);

export default router;