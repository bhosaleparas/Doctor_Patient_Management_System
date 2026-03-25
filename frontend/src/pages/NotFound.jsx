import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
    <p className="text-8xl mb-4">🏥</p>
    <h1 className="text-6xl font-bold text-primary-600 mb-2">404</h1>
    <p className="text-xl text-gray-700 mb-2">Page not found</p>
    <p className="text-gray-400 text-sm mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Go Home</Link>
  </div>
);

export default NotFound;
