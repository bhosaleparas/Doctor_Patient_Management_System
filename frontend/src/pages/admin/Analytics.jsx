import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import StatsCard from '../../components/common/StatsCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import useFetch from '../../hooks/useFetch';
import { getAnalytics } from '../../services/adminService';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';

const Analytics = () => {
  const { data, loading } = useFetch(getAnalytics);

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader /></div>;

  const overview       = data?.overview               || {};
  const overTime       = data?.appointmentsOverTime   || [];
  const bySpecialty    = data?.mostBookedSpecialty     || [];
  const byDoctor       = data?.mostBookedDoctors       || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper title="Analytics" subtitle="Insights and booking statistics">

        {/* Overview stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Total Patients"     value={overview.totalPatients}      icon="🧑"  color="blue" />
          <StatsCard title="Active Doctors"     value={overview.activeDoctors}      icon="👨‍⚕️" color="green" />
          <StatsCard title="Total Appointments" value={overview.totalAppointments}  icon="📋"  color="teal" />
          <StatsCard
            title="Cancellation Rate"
            value={overview.cancellationRate}
            icon="❌"
            color="red"
            sub={`${overview.cancelledAppointments} cancelled`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Line chart — appointments over time */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Appointments (Last 30 Days)
            </h2>
            {overTime.length === 0 ? (
              <EmptyState icon="📈" title="No data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={overTime} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => new Date(v).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                  />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    labelFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  />
                  <Line type="monotone" dataKey="count" stroke="#1e6ef1" strokeWidth={2} dot={false} name="Appointments" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar chart — most booked specialty */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Most Booked Specialties
            </h2>
            {bySpecialty.length === 0 ? (
              <EmptyState icon="📊" title="No data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={bySpecialty} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="specialty" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar chart — most booked doctors */}
          <div className="card lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Most Booked Doctors
            </h2>
            {byDoctor.length === 0 ? (
              <EmptyState icon="👨‍⚕️" title="No data yet" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={byDoctor.map((d) => ({
                    name : d.doctor?.name || `Doctor ${d.doctorId}`,
                    count: d.totalBookings,
                  }))}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1e6ef1" radius={[4, 4, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default Analytics;
