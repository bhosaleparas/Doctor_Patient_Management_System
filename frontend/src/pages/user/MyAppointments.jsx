import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import AppointmentCard from '../../components/user/AppointmentCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Select from '../../components/common/Select';
import useFetch from '../../hooks/useFetch';
import { getMyAppointments } from '../../services/userService';


const statusOptions = [
  { value: 'pending',   label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show',   label: 'No Show' },
];


const MyAppointments = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, loading, refetch } = useFetch(getMyAppointments);

  const all = data?.appointments || [];
  const filtered = statusFilter
    ? all.filter((a) => a.status === statusFilter)
    : all;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title="My Appointments"
        subtitle="Your complete appointment history"
      >
        {/* filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-48">
            <Select
              placeholder="All statuses"
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <span className="text-sm text-gray-400">{filtered.length} appointment(s)</span>
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No appointments"
            message={statusFilter ? `No ${statusFilter} appointments found` : 'You have no appointments yet'}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((a) => (
              <AppointmentCard key={a.id} appointment={a} onRefresh={refetch} />
            ))}
          </div>
        )}
      </PageWrapper>
    </div>
  );
};

export default MyAppointments;
