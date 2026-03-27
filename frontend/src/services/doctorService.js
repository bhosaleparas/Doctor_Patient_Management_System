import api from './api';
import { API } from '../constants/apiEndpoints';

export const getDoctorAppointments = (params) => api.get(API.DOCTOR_APPOINTMENTS, { params });
export const markComplete          = (id)     => api.patch(API.MARK_COMPLETE(id));
export const markNoShow            = (id)     => api.patch(API.MARK_NO_SHOW(id));
export const setAvailability       = (data)   => api.post(API.SET_AVAILABILITY, data);
export const getDoctorSlots        = (params) => api.get(API.DOCTOR_SLOTS, { params });
export const blockSlot             = (id) => api.patch(API.BLOCK_SLOT(id));
export const unblockSlot           = (id) => api.patch(API.UNBLOCK_SLOT(id));