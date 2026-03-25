import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Unauthorized = () => {
  const { role } = useAuth();

  const homeLink =
    role === 'doctor' ? '/doctor/dashboard' :
    role === 'admin'  ? '/admin/dashboard'  :
    '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <p className="text-7xl mb-4">🔒</p>
      <h1 className="text-4xl font-bold text-red-500 mb-2">Access Denied</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        You don't have permission to view this page.
      </p>
      <Link to={homeLink} className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
