import { Routes, Route, Navigate } from 'react-router-dom';
import RoleRoute      from './RoleRoute';
import useAuth        from '../hooks/useAuth';

// public pages
import Home           from '../pages/public/Home';
import Login          from '../pages/public/Login';
import Register       from '../pages/public/Register';

// user pages
import UserDashboard    from '../pages/user/UserDashboard';
import HospitalList     from '../pages/user/HospitalList';
import HospitalDetail   from '../pages/user/HospitalDetail';
import DoctorDetail     from '../pages/user/DoctorDetail';
import BookAppointment  from '../pages/user/BookAppointment';
import MyAppointments   from '../pages/user/MyAppointments';

// doctor pages
import DoctorDashboard    from '../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';
import ManageSlots        from '../pages/doctor/ManageSlots';
import ChangePassword     from '../pages/doctor/ChangePassword';

// admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageDoctors  from '../pages/admin/ManageDoctors';
import Analytics      from '../pages/admin/Analytics';
import ManageUsers from '../pages/admin/ManageUsers';

// other
import NotFound    from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

const AppRoutes = () => {
  const { user, role } = useAuth();

  const RedirectIfLoggedIn = ({ children }) => {
    if (!user) return children;
    if (role === 'user')   return <Navigate to="/dashboard" replace />;
    if (role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    if (role === 'admin')  return <Navigate to="/admin/dashboard" replace />;
    return children;
  };

  return (
    <Routes>
      {/* public */}
      <Route path="/"         element={<Home />} />
      <Route path="/login"    element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
      <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />

      {/* user */}
      <Route path="/dashboard"           element={<RoleRoute allowedRole="user"><UserDashboard /></RoleRoute>} />
      <Route path="/hospitals"      element={<HospitalList />} />
      <Route path="/hospital/:slug" element={<HospitalDetail />} />
      <Route path="/doctors/:id"         element={<RoleRoute allowedRole="user"><DoctorDetail /></RoleRoute>} />
      <Route path="/book/:doctorId"      element={<RoleRoute allowedRole="user"><BookAppointment /></RoleRoute>} />
      <Route path="/my-appointments"     element={<RoleRoute allowedRole="user"><MyAppointments /></RoleRoute>} />

      {/* doctor */}
      <Route path="/doctor/dashboard"    element={<RoleRoute allowedRole="doctor"><DoctorDashboard /></RoleRoute>} />
      <Route path="/doctor/appointments" element={<RoleRoute allowedRole="doctor"><DoctorAppointments /></RoleRoute>} />
      <Route path="/doctor/slots"        element={<RoleRoute allowedRole="doctor"><ManageSlots /></RoleRoute>} />
      <Route path="/doctor/password"     element={<RoleRoute allowedRole="doctor"><ChangePassword /></RoleRoute>} />

      {/* admin */}
      <Route path="/admin/dashboard" element={<RoleRoute allowedRole="admin"><AdminDashboard /></RoleRoute>} />
      <Route path="/admin/doctors"   element={<RoleRoute allowedRole="admin"><ManageDoctors /></RoleRoute>} />
      <Route path="/admin/analytics" element={<RoleRoute allowedRole="admin"><Analytics /></RoleRoute>} />
      <Route path="/admin/users" element={<RoleRoute allowedRole="admin"><ManageUsers /></RoleRoute>} />


      {/* other */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*"             element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
