import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import StatsCard from '../../components/common/StatsCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import AppointmentCard from '../../components/user/AppointmentCard';
import useFetch from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import { getMyAppointments } from '../../services/userService';

const UserDashboard = () => {
  const { user } = useAuth();
  const { data, loading, refetch } = useFetch(getMyAppointments);

  const appointments   = data?.appointments || [];
  const pending        = appointments.filter((a) => a.status === 'pending');
  const completed      = appointments.filter((a) => a.status === 'completed');
  const cancelled      = appointments.filter((a) => a.status === 'cancelled');
  const upcoming       = pending.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title={`Welcome back, ${user?.name} 👋`}
        subtitle="Here's a summary of your health activity"
        action={
          <Link to="/hospitals" className="btn-primary">
            + Book Appointment
          </Link>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Appointments" value={appointments.length} icon="📋" color="blue" />
          <StatsCard title="Upcoming"           value={pending.length}      icon="🕐" color="yellow" />
          <StatsCard title="Completed"          value={completed.length}    icon="✅" color="green" />
          <StatsCard title="Cancelled"          value={cancelled.length}    icon="❌" color="red" />
        </div>

        {/* Upcoming appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
            <Link to="/my-appointments" className="text-sm text-primary-600 hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No upcoming appointments"
              message="Book an appointment with a doctor to get started"
            />
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((a) => (
                <AppointmentCard key={a.id} appointment={a} onRefresh={refetch} />
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
};

export default UserDashboard;
