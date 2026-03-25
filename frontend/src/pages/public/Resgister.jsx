import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import useAuth from '../../hooks/useAuth';
import { registerUser } from '../../services/authService';


const genderOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' },
];


const defaultForm = {
  name: '', email: '', password: '', phone: '',
  dob: '', city: '', address: '', pincode: '', gender: '',
};



const Register = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form,     setForm]    = useState(defaultForm);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState('');

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-4xl">🏥</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Register as a patient</p>
        </div>

        <div className="card shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Paras Shah"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="paras@example.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
              <Input
                label="Phone"
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                value={form.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                required
              />
              <Select
                label="Gender"
                placeholder="Select gender"
                options={genderOptions}
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                required
              />
              <Input
                label="City"
                placeholder="Pune"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
              <Input
                label="Pincode"
                placeholder="411001"
                value={form.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                required
              />
            </div>
            <Input
              label="Address"
              placeholder="123 MG Road"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
            />

            {error && <Alert type="error" message={error} />}

            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
