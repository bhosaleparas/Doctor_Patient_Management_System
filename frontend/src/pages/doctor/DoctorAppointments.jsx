import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import AppointmentTable from '../../components/doctor/AppointmentTable';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getDoctorAppointments } from '../../services/doctorService';


const statusOptions = [
  { value: 'pending',   label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show',   label: 'No Show' },
];

const DoctorAppointments = () => {
  const [date,     setDate]     = useState('');
  const [status,   setStatus]   = useState('');
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (date)   params.date   = date;
      if (status) params.status = status;
      const res = await getDoctorAppointments(params);
      setData(res.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const appointments = data?.appointments || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title="Appointments"
        subtitle="Filter and manage your patient appointments"
      >
        {/* filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              label="Filter by date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Select
              label="Filter by status"
              placeholder="All statuses"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
            <div className="flex items-end gap-2">
              <Button onClick={fetchAppointments} loading={loading}>Search</Button>
              <Button variant="ghost" onClick={() => { setDate(''); setStatus(''); setData(null); }}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          {loading ? (
            <Loader />
          ) : (
            <>
              {data && (
                <p className="text-sm text-gray-400 mb-4">
                  {appointments.length} appointment(s) found
                </p>
              )}
              <AppointmentTable
                appointments={appointments}
                onRefresh={fetchAppointments}
              />
              {!data && (
                <p className="text-center text-gray-400 text-sm py-10">
                  Use filters above to search appointments
                </p>
              )}
            </>
          )}
        </div>
      </PageWrapper>
    </div>
  );
};

export default DoctorAppointments;
