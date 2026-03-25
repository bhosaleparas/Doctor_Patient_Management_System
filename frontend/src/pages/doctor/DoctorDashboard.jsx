import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import StatsCard from '../../components/common/StatsCard';
import Loader from '../../components/common/Loader';
import AppointmentTable from '../../components/doctor/AppointmentTable';
import useFetch from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import { getDoctorAppointments } from '../../services/doctorService';
import { todayString } from '../../utils/formatDate';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { data, loading, refetch } = useFetch(() =>
    getDoctorAppointments({ date: todayString() })
  );

  const todayAppointments = data?.appointments || [];
  const pending   = todayAppointments.filter((a) => a.status === 'pending');
  const completed = todayAppointments.filter((a) => a.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title={`Good day, ${user?.name} 👨‍⚕️`}
        subtitle="Here's your schedule for today"
        action={
          <Link to="/doctor/slots" className="btn-primary">
            + Manage Slots
          </Link>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Today's Total"  value={todayAppointments.length} icon="📋" color="blue" />
          <StatsCard title="Pending"        value={pending.length}           icon="🕐" color="yellow" />
          <StatsCard title="Completed"      value={completed.length}         icon="✅" color="green" />
          <StatsCard title="Cabin"          value={user?.cabin || '—'}       icon="🚪" color="teal" />
        </div>

        {/* Today's appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Today's Appointments</h2>
            <Link to="/doctor/appointments" className="text-sm text-primary-600 hover:underline">
              View all →
            </Link>
          </div>
          {loading ? <Loader /> : (
            <AppointmentTable appointments={todayAppointments} onRefresh={refetch} />
          )}
        </div>
      </PageWrapper>
    </div>
  );
};

export default DoctorDashboard;
