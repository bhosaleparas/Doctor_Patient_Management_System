import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';



const navLinks = {
  user  : [
    { label: 'Dashboard',       to: '/dashboard' },
    { label: 'Find Hospitals',  to: '/hospitals' },
    { label: 'My Appointments', to: '/my-appointments' },
  ],
  doctor: [
    { label: 'Dashboard',       to: '/doctor/dashboard' },
    { label: 'Appointments',    to: '/doctor/appointments' },
    { label: 'Manage Slots',    to: '/doctor/slots' },
    { label: 'Change Password', to: '/doctor/password' },   
  ],
  admin : [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Doctors',   to: '/admin/doctors' },
    { label: 'Analytics', to: '/admin/analytics' },
  ],
};


const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = navLinks[role] || [];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <span className="font-heading text-xl font-bold text-primary-700">MediBook</span>
          </Link>


          {/* Nav links*/}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}


          {/* right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-gray-500">
                  Hi, <span className="font-semibold text-gray-700">{user.name || user.username}</span>
                  <span className="ml-1 text-xs text-primary-500 capitalize">({role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="text-sm font-medium text-gray-600 hover:text-primary-600">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>
        </div>


        {/* responsive nav links */}
        {user && (
          <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 whitespace-nowrap transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
