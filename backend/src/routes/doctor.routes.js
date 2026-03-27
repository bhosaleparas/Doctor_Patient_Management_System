import { Router } from "express";
import {changePasswordDoctor, doctorAppointments, markAppointmentCompleted, markNoShow, getDoctorProfile } from "../controllers/doctor.controller.js";
import {protectDoctor} from '../middleware/doctor.auth.js'
import {loginDoctor} from '../controllers/auth/doctor.auth.controller.js'
import { setAvailability, getDoctorSlots, blockSlot, unblockSlot } from "../controllers/slot.controller.js";


const router=Router();


// endpoints

// Authentication
router.post('/login', loginDoctor);
router.patch('/password', protectDoctor, changePasswordDoctor);

// Appointments
router.get('/appointments', protectDoctor, doctorAppointments);
router.patch('/appointments/:id/complete', protectDoctor, markAppointmentCompleted);

// Availability
router.post('/availability', protectDoctor, setAvailability);
router.get('/slots', protectDoctor, getDoctorSlots);

// slot 
router.patch('/slot/:id/block',   protectDoctor, blockSlot)
router.patch('/slot/:id/unblock', protectDoctor, unblockSlot)

router.patch('/appointments/:id/no-show', protectDoctor, markNoShow);  
router.get('/profile',protectDoctor, getDoctorProfile); 

export default router;