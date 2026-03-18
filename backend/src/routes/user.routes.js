import { Router } from "express";
import { registerUser,loginUser } from "../controllers/user.controller.js";



const router=Router();


// endpoints
router.post('/register',registerUser);
router.post('/login',loginUser);

export default router;