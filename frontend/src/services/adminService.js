import api from './api';
import { API } from '../constants/apiEndpoints';

export const getAllDoctors      = ()   => api.get(API.ADMIN_ALL_DOCTORS);
export const getAllUsers        = ()   => api.get(API.ADMIN_ALL_USERS);
export const addDoctor         = (data) => api.post(API.ADMIN_ADD_DOCTOR, data);
export const deactivateDoctor  = (id)   => api.patch(API.ADMIN_DEACTIVATE_DOCTOR(id));
export const reactivateDoctor  = (id)   => api.patch(API.ADMIN_REACTIVATE_DOCTOR(id));
export const getAnalytics      = ()     => api.get(API.ADMIN_ANALYTICS);
