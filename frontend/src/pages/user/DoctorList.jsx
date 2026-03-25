import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import DoctorCard from '../../components/user/DoctorCard';
import DoctorFilters from '../../components/user/DoctorFilters';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Alert from '../../components/common/Alert';
import { searchDoctors } from '../../services/userService';

const defaultFilters = { name: '', specialization: '', gender: '', date: '' };

const DoctorList = () => {
  const [doctors,  setDoctors]  = useState([]);
  const [filters,  setFilters]  = useState(defaultFilters);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [searched, setSearched] = useState(false);

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleSearch = async (overrideFilters) => {
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      // Remove empty keys
      const params = Object.fromEntries(
        Object.entries(overrideFilters || filters).filter(([, v]) => v !== '')
      );
      const res = await searchDoctors(params);
      setDoctors(res.data?.doctors || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setDoctors([]);
    setSearched(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title="Find a Doctor"
        subtitle="Search and filter to find the right doctor for you"
      >
        <DoctorFilters
          filters={filters}
          onChange={handleFilterChange}
          onSearch={() => handleSearch()}
          onReset={handleReset}
          loading={loading}
        />

        {error && <Alert type="error" message={error} />}

        {loading ? (
          <Loader text="Searching doctors..." />
        ) : searched && doctors.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No doctors found"
            message="Try changing your filters or search terms"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🏥</p>
            <p className="text-sm">Use the filters above and click Search to find doctors</p>
          </div>
        )}
      </PageWrapper>
    </div>
  );
};

export default DoctorList;
