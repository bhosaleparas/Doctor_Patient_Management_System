import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { addDoctor } from '../../services/adminService';
import specializationOptions from '../../constants/specializationOptions';

// const specializationOptions = [
//   { value: 'Cardiology',     label: 'Cardiology' },
//   { value: 'Dermatology',    label: 'Dermatology' },
//   { value: 'Orthopedics',    label: 'Orthopedics' },
//   { value: 'Pediatrics',     label: 'Pediatrics' },
//   { value: 'Neurology',      label: 'Neurology' },
//   { value: 'Gynecology',     label: 'Gynecology' },
//   { value: 'General',        label: 'General Physician' },
//   { value: 'Ophthalmology',  label: 'Ophthalmology' },
//   { value: 'ENT',            label: 'ENT' },
//   { value: 'Psychiatry',     label: 'Psychiatry' },
// ];

const genderOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
];

const defaultForm = {
  username      : '',
  email         : '',
  name          : '',
  password      : '',
  specialization: '',
  cabin         : '',
  fee           : '',
  gender        : '',
  hospitalId    : '',
};

const AddDoctorForm = ({ hospitalId, onSuccess }) => {
  const [form,    setForm]    = useState({ ...defaultForm, hospitalId });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addDoctor(form);
      setSuccess('Doctor added successfully!');
      setForm({ ...defaultForm, hospitalId });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="Dr. Ramesh Sharma"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <Input
          label="Username"
          placeholder="drramesh01"
          value={form.username}
          onChange={(e) => handleChange('username', e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="doctor@hospital.com"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
        <Input
          label="Temporary Password"
          type="password"
          placeholder="Min 6 characters"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
        />
        <Select
          label="Specialization"
          placeholder="Select specialization"
          options={specializationOptions}
          value={form.specialization}
          onChange={(e) => handleChange('specialization', e.target.value)}
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
          label="Cabin"
          placeholder="A-101"
          value={form.cabin}
          onChange={(e) => handleChange('cabin', e.target.value)}
          required
        />
        <Input
          label="Consultation Fee (₹)"
          type="number"
          placeholder="500"
          value={form.fee}
          onChange={(e) => handleChange('fee', e.target.value)}
          required
        />
      </div>

      {error   && <Alert type="error"   message={error} />}
      {success && <Alert type="success" message={success} />}

      <Button type="submit" loading={loading} className="w-full sm:w-auto">
        Add Doctor
      </Button>
    </form>
  );
};

export default AddDoctorForm;
