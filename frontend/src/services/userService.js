import api from './api';
import { API } from '../constants/apiEndpoints';

export const searchDoctors      = (params)    => api.get(API.SEARCH_DOCTOR, { params });
export const getDoctorById      = (id)        => api.get(API.DOCTOR_BY_ID(id));
export const getAvailableSlots  = (doctorId, date) => api.get(API.AVAILABLE_SLOTS(doctorId), { params: { date } });
export const bookAppointment    = (data)      => api.post(API.BOOK_APPOINTMENT, data);
export const getMyAppointments  = (params)    => api.get(API.MY_APPOINTMENTS, { params });
export const cancelAppointment  = (id)        => api.patch(API.CANCEL_APPOINTMENT(id));
