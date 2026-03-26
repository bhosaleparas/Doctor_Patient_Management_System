const BASE = import.meta.env.VITE_API_URL;

export const API = {
  // User Auth
  USER_REGISTER : `${BASE}/user/register`,
  USER_LOGIN    : `${BASE}/user/login`,

  // Doctor Auth
  DOCTOR_LOGIN          : `${BASE}/doctor/login`,
  DOCTOR_CHANGE_PASSWORD: `${BASE}/doctor/password`,

  // Admin Auth
  ADMIN_LOGIN   : `${BASE}/admin/login`,
  ADMIN_REGISTER: `${BASE}/admin/register`,

  // Hospital
  ALL_HOSPITALS   : `${BASE}/hospital/all`,
  SEARCH_HOSPITALS: `${BASE}/hospital/search`,
  HOSPITAL_BY_SLUG: (slug) => `${BASE}/hospital/${slug}`,

  // Hospital scoped doctors — replaces global search
  HOSPITAL_DOCTORS: (slug) => `${BASE}/hospital/${slug}/doctors`,

  // User - Appointments
  DOCTOR_BY_ID      : (id)       => `${BASE}/user/doctor/${id}`,
  AVAILABLE_SLOTS   : (doctorId) => `${BASE}/user/doctor/available/${doctorId}`,
  BOOK_APPOINTMENT  : `${BASE}/user/book`,
  MY_APPOINTMENTS   : `${BASE}/user/my-appointments`,
  CANCEL_APPOINTMENT: (id) => `${BASE}/user/cancel-appointment/${id}`,

  // Doctor - Appointments
  DOCTOR_APPOINTMENTS: `${BASE}/doctor/appointments`,
  MARK_COMPLETE      : (id) => `${BASE}/doctor/appointments/${id}/complete`,
  MARK_NO_SHOW       : (id) => `${BASE}/doctor/appointments/${id}/no-show`,

  // Doctor - Slots
  SET_AVAILABILITY: `${BASE}/doctor/availability`,
  DOCTOR_SLOTS    : `${BASE}/doctor/slots`,

  // Admin
  ADMIN_ADD_DOCTOR       : `${BASE}/admin/doctors`,
  ADMIN_DEACTIVATE_DOCTOR: (id) => `${BASE}/admin/doctors/${id}/deactivate`,
  ADMIN_REACTIVATE_DOCTOR: (id) => `${BASE}/admin/doctors/${id}/reactivate`,
  ADMIN_ALL_DOCTORS      : `${BASE}/admin/doctors`,
  ADMIN_ALL_USERS        : `${BASE}/admin/users`,
  ADMIN_ANALYTICS        : `${BASE}/admin/analytics`,
};
