import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { changePasswordDoctor } from '../../services/authService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      return setError('New passwords do not match');
    }
    if (form.newPassword.length < 6) {
      return setError('New password must be at least 6 characters');
    }
    setLoading(true);
    setError('');
    try {
      await changePasswordDoctor({
        currentPassword: form.currentPassword,
        newPassword    : form.newPassword,
      });
      setSuccess('Password changed successfully! Redirecting...');
      setTimeout(() => navigate('/doctor/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper title="Change Password">
        <div className="max-w-md mx-auto">
          <div className="card shadow-md">
            <div className="text-center mb-6">
              <span className="text-4xl">🔐</span>
              <p className="text-sm text-gray-500 mt-2">
                Keep your account secure with a strong password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={form.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Min 6 characters"
                value={form.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                value={form.confirm}
                onChange={(e) => handleChange('confirm', e.target.value)}
                required
              />

              {error   && <Alert type="error"   message={error} />}
              {success && <Alert type="success" message={success} />}

              <Button type="submit" loading={loading} className="w-full mt-2">
                Change Password
              </Button>
            </form>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default ChangePassword;
