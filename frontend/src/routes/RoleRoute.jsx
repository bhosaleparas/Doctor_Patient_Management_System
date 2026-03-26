import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';


// redirects if user doesn't have the required role
const RoleRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user)   return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default RoleRoute;
