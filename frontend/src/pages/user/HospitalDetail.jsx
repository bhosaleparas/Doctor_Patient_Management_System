import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import DoctorCard from '../../components/user/DoctorCard';
import DoctorFilters from '../../components/user/DoctorFilters';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Alert from '../../components/common/Alert';
import useFetch from '../../hooks/useFetch';
import { getHospitalBySlug, getHospitalDoctors } from '../../services/hospitalService';


const defaultFilters = { name: '', specialization: '', gender: '', date: '' };

const HospitalDetail = () => {
  const { slug } = useParams();

  const [filters,  setFilters]  = useState(defaultFilters);
  const [doctors,  setDoctors]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [searched, setSearched] = useState(false);

  // Load hospital info
  const { data: hospitalData, loading: hospitalLoading } = useFetch(
    () => getHospitalBySlug(slug)
  );

  const hospital = hospitalData?.hospital || hospitalData;

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      // Strip empty values
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const res = await getHospitalDoctors(slug, params);
      setDoctors(res.data?.doctors || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setDoctors(null);
    setSearched(false);
    setError('');
  };

  // Show all doctors on first load (no filters)
  const handleLoadAll = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await getHospitalDoctors(slug, {});
      setDoctors(res.data?.doctors || []);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hospital header */}
      {hospitalLoading ? (
        <Loader />
      ) : hospital ? (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl flex-shrink-0">
                🏥
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">{hospital.name}</h1>
                <p className="text-teal-600 text-sm font-medium mt-0.5">
                  📍 {hospital.address}, {hospital.city} — {hospital.pincode}
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                  <span>📞 {hospital.phone}</span>
                  <span>✉️ {hospital.email}</span>
                  {hospital._count?.doctors !== undefined && (
                    <span>👨‍⚕️ {hospital._count.doctors} Doctors</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <PageWrapper>
        {/* Filters */}
        <DoctorFilters
          filters={filters}
          onChange={handleFilterChange}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={loading}
        />

        {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

        {loading ? (
          <Loader text="Loading doctors..." />
        ) : !searched ? (
          // Initial state — prompt to search or load all
          <div className="text-center py-16">
            <p className="text-5xl mb-4">👨‍⚕️</p>
            <p className="text-gray-500 mb-4">
              Use filters above to find a specific doctor or load all doctors
            </p>
            <button
              onClick={handleLoadAll}
              className="text-primary-600 font-medium hover:underline text-sm"
            >
              Show all doctors →
            </button>
          </div>
        ) : doctors?.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No doctors found"
            message="Try changing your filters"
          />
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {doctors?.length} doctor(s) available
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors?.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          </>
        )}
      </PageWrapper>
    </div>
  );
};

export default HospitalDetail;
