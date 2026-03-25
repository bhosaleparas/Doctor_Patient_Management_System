import { Router } from "express";
import { createHospital,getAllHospitals,getHospitalsByCity,searchHospitals, getHospitalDoctors,getHospitalBySlug } from "../controllers/hospital.controller.js";

const router=Router();


// endpoints

router.post('/create',          createHospital);
router.get('/all',              getAllHospitals);
router.get('/search',           searchHospitals);      
router.get('/:slug/doctors',    getHospitalDoctors);  
router.get('/city/:city',       getHospitalsByCity);   
router.get('/:slug',            getHospitalBySlug);    

export default router;