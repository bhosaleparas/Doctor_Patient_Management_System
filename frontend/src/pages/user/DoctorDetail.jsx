import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import useFetch from '../../hooks/useFetch';
import { getDoctorById } from '../../services/userService';

const DoctorDetail = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { data, loading } = useFetch(() => getDoctorById(id));

  const doctor = data?.doctor || data;

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader /></div>;
  if (!doctor) return <div className="min-h-screen bg-gray-50"><Navbar /><p className="text-center mt-20 text-gray-400">Doctor not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          <div className="card shadow-md">
            {/* Header */}
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary-100 flex items-center justify-center text-4xl flex-shrink-0">
                {doctor.gender === 'F' ? '👩‍⚕️' : '👨‍⚕️'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
                <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                {doctor.hospital && (
                  <p className="text-sm text-gray-400 mt-1">
                    🏥 {doctor.hospital.name}, {doctor.hospital.city}
                  </p>
                )}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Cabin',      value: doctor.cabin },
                { label: 'Fee',        value: `₹${doctor.fee}` },
                { label: 'Gender',     value: doctor.gender === 'M' ? 'Male' : 'Female' },
                { label: 'Status',     value: doctor.status ? '✅ Active' : '❌ Inactive' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-semibold text-gray-700 mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Book button */}
            <Button
              className="w-full"
              disabled={!doctor.status}
              onClick={() => navigate(`/book/${doctor.id}`)}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default DoctorDetail;
