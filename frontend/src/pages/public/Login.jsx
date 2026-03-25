import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import useAuth from '../../hooks/useAuth';
import { loginUser, loginDoctor, loginAdmin } from '../../services/authService';


const roleConfig = {
  user  : { fn: loginUser,   key: 'user',   nameKey: 'name' },
  doctor: { fn: loginDoctor, key: 'doctor', nameKey: 'name' },
  admin : { fn: loginAdmin,  key: 'admin',  nameKey: 'username' },
};

const Login = () => {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [role,     setRole]     = useState('user');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [form,     setForm]     = useState({ email: '', username: '', password: '' });

  const isEmailLogin = role === 'user' || role === 'doctor';

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const cfg     = roleConfig[role];
      const payload = role === 'admin'
        ? { username: form.username, password: form.password }
        : { email: form.email, password: form.password };

      const res      = await cfg.fn(payload);
      const data     = res.data;
      const userData = data[cfg.key];

      login(userData, role, data.token);

      // redirect based on role
      if (role === 'user')   navigate('/dashboard');
      if (role === 'doctor') navigate('/doctor/dashboard');
      if (role === 'admin')  navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🏥</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">MediBook</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card shadow-lg">
          
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {['user', 'doctor', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all
                  ${role === r ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                {r === 'user' ? '🧑 Patient' : r === 'doctor' ? '👨‍⚕️ Doctor' : '🛡️ Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isEmailLogin ? (
              <Input
                label="Email"
                type="email"
                placeholder="abc@pqrs.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            ) : (
              <Input
                label="Username"
                placeholder="Username"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
              />
            )}
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />

            {error && <Alert type="error" message={error} />}

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          {role === 'user' && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:underline">
                Register
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
