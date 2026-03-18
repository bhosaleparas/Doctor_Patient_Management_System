import { Router } from "express";
import {loginDoctor } from "../controllers/doctor.controller.js";


const router=Router();


// endpoints
// router.post('/register',registerDoctor);
router.post('/login',loginDoctor);

export default router;