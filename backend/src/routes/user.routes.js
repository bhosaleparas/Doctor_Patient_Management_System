import { Router } from "express";
import {searchDoctor,bookAppointment,getDoctorById,getUserAppointments,cancelAppointment} from "../controllers/user.controller.js";
import { registerUser,loginUser} from '../controllers/auth/user.auth.controller.js'
import { protectUser } from "../middleware/user.auth.js";
import { getAvailableSlotsForUser,bookSlot } from "../controllers/slot.controller.js";


const router=Router();



// endpoints
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/search-doctor',protectUser,searchDoctor);
router.post("book-appointment/:id",bookAppointment);
router.post('cancel-appointment/:id',cancelAppointment);
router.get("/doctor/:id",protectUser, getDoctorById);
router.get('/doctor/available/:doctorId',protectUser, getAvailableSlotsForUser);      
router.post('/book', protectUser, bookSlot); 
router.get("/my-appointments",protectUser,getUserAppointments);
router.patch("/cancel-appointment/:id",protectUser,cancelAppointment);

export default router;