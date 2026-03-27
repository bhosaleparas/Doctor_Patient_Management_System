import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import StatsCard from '../../components/common/StatsCard';
import Loader from '../../components/common/Loader';
import useFetch from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import { getAnalytics } from '../../services/adminService';
import { getAllUsers } from '../../services/adminService';


const AdminDashboard = () => {
  const { user }          = useAuth();
  const { data, loading } = useFetch(getAnalytics);
  const overview          = data?.overview || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title={`Admin Panel 🛡️`}
        subtitle={`Hospital management for ${user?.hospital?.name || 'your hospital'}`}
        action={
          <Link to="/admin/doctors" className="btn-primary">
            + Add Doctor
          </Link>
        }
      >
        {loading ? <Loader /> : (
          <>
            {/* stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard title="Total Patients"      value={overview.totalPatients}      icon="🧑" color="blue" />
              <StatsCard title="Active Doctors"      value={overview.activeDoctors}      icon="👨‍⚕️" color="green" />
              <StatsCard title="Total Appointments"  value={overview.totalAppointments}  icon="📋" color="teal" />
              <StatsCard
                title="Cancellation Rate"
                value={overview.cancellationRate}
                icon="❌"
                color="red"
              />
            </div>

            {/* quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Manage Doctors', desc: 'Add, activate or deactivate doctors', to: '/admin/doctors', icon: '👨‍⚕️' },
                { title: 'Analytics',      desc: 'Charts and booking insights',          to: '/admin/analytics', icon: '📊' },
                { title: 'Patients',       desc: 'View all registered patients',          to: '/admin/users', icon: '🧑' },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="card hover:shadow-md transition-shadow group">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
