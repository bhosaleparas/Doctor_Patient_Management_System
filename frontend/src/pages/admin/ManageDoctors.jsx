import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import DoctorTable from '../../components/admin/DoctorTable';
import AddDoctorForm from '../../components/admin/AddDoctorForm';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import useFetch from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';
import { getAllDoctors } from '../../services/adminService';

const ManageDoctors = () => {
  const { user }           = useAuth();
  const [showForm, setShowForm] = useState(false);
  const { data, loading, refetch } = useFetch(getAllDoctors);

  // Handle both { doctors: [] } and { data: [] } response shapes
  const doctors = data?.doctors || data?.data || [];

  // hospitalId can be nested inside user object depending on your login response
  const hospitalId = user?.hospitalId || user?.hospital?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title="Manage Doctors"
        subtitle={`${doctors.length} doctor(s) in your hospital`}
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Doctor'}
          </Button>
        }
      >
        {/* Add doctor form */}
        {showForm && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Add New Doctor</h2>
            {!hospitalId ? (
              <p className="text-sm text-red-500">
                ⚠️ Hospital ID not found in your session. Please logout and login again.
              </p>
            ) : (
              <AddDoctorForm
                hospitalId={hospitalId}
                onSuccess={() => { setShowForm(false); refetch(); }}
              />
            )}
          </div>
        )}

        {/* Doctors table */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">All Doctors</h2>
            {/* Status legend */}
            <div className="flex gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Inactive
              </span>
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <DoctorTable doctors={doctors} onRefresh={refetch} />
          )}
        </div>
      </PageWrapper>
    </div>
  );
};

export default ManageDoctors;
