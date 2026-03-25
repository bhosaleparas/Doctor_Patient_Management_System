import api from './api';
import { API } from '../constants/apiEndpoints';

// ── User ──────────────────────────────────────────────────
export const registerUser = (data) => api.post(API.USER_REGISTER, data);
export const loginUser    = (data) => api.post(API.USER_LOGIN, data);

// ── Doctor ────────────────────────────────────────────────
export const loginDoctor          = (data) => api.post(API.DOCTOR_LOGIN, data);
export const changePasswordDoctor = (data) => api.patch(API.DOCTOR_CHANGE_PASSWORD, data);

// ── Admin ─────────────────────────────────────────────────
export const loginAdmin    = (data) => api.post(API.ADMIN_LOGIN, data);
export const registerAdmin = (data) => api.post(API.ADMIN_REGISTER, data);
