import api from './api';
import { API } from '../constants/apiEndpoints';

export const getAllHospitals    = ()           => api.get(API.ALL_HOSPITALS);
export const searchHospitals    = (params)     => api.get(API.SEARCH_HOSPITALS, { params });
export const getHospitalBySlug  = (slug)       => api.get(API.HOSPITAL_BY_SLUG(slug));
export const getHospitalDoctors = (slug, params) => api.get(API.HOSPITAL_DOCTORS(slug), { params });
