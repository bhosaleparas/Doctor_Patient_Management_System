import { Router } from "express";
import {searchDoctor,bookAppointment,getDoctorById,getUserAppointments,cancelAppointment} from "../controllers/user.controller.js";
import { registerUser,loginUser} from '../controllers/auth/user.auth.controller.js'
import { protectUser } from "../middleware/user.auth.js";
import { getAvailableSlotsForUser,bookSlot } from "../controllers/slot.controller.js";
import { protectDoctor } from "../middleware/doctor.auth.js";


const router=Router();



// endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);


// Doctor search & details
router.get('/search-doctor', protectUser, searchDoctor);
router.get('/doctor/:id', protectUser, getDoctorById);
router.get('/doctor/available/:doctorId', protectUser, getAvailableSlotsForUser);

// Appointment management
router.post('/book', protectUser, bookSlot); // pass doctorId + slotId in body
router.patch('/cancel-appointment/:id', protectUser, cancelAppointment);
router.get('/my-appointments', protectUser, getUserAppointments);

export default router;