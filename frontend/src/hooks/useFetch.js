import { useState, useEffect } from 'react';

// Generic fetch hook
// usage: const { data, loading, error, refetch } = useFetch(apiFn, params)
const useFetch = (apiFn, params = null, runOnMount = true) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetch = async (overrideParams = null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(overrideParams ?? params);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (runOnMount) fetch();
  }, []);

  return { data, loading, error, refetch: fetch };
};

export default useFetch;
