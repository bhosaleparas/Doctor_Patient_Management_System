import { Router } from "express";
import { createHospital,getAllHospitals,getHospitalsByCity } from "../controllers/hospital.controller.js";

const router=Router();


// endpoints

router.post('/create', createHospital);             
router.get('/all', getAllHospitals);   
router.get('/:city',getHospitalsByCity);

export default router;