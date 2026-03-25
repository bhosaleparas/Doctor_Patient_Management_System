import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import HospitalCard from '../../components/user/HospitalCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Alert from '../../components/common/Alert';
import useFetch from '../../hooks/useFetch';
import { getAllHospitals, searchHospitals } from '../../services/hospitalService';

const HospitalList = () => {
  const [query,    setQuery]    = useState('');
  const [city,     setCity]     = useState('');
  const [results,  setResults]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Load all hospitals on mount
  const { data, loading: initLoading } = useFetch(getAllHospitals);
  const allHospitals = data?.hospitals || [];

  const handleSearch = async () => {
    if (!query && !city) {
      setResults(null); // reset to show all
      return;
    }
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (query) params.q    = query;
      if (city)  params.city = city;
      const res = await searchHospitals(params);
      setResults(res.data?.hospitals || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setCity('');
    setResults(null);
    setError('');
  };

  const displayed = results ?? allHospitals;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title="Find a Hospital"
        subtitle="Choose a hospital to browse its doctors and book appointments"
      >
        {/* Search bar */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search hospital by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Input
              placeholder="Filter by city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="flex gap-2 flex-shrink-0">
              <Button loading={loading} onClick={handleSearch}>Search</Button>
              <Button variant="ghost" onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        {initLoading || loading ? (
          <Loader text="Loading hospitals..." />
        ) : displayed.length === 0 ? (
          <EmptyState
            icon="🏥"
            title="No hospitals found"
            message="Try a different search term or city"
          />
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {displayed.length} hospital(s) found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayed.map((h) => (
                <HospitalCard key={h.id} hospital={h} />
              ))}
            </div>
          </>
        )}
      </PageWrapper>
    </div>
  );
};

export default HospitalList;
