import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import { deactivateDoctor, reactivateDoctor } from '../../services/adminService';

const DoctorTable = ({ doctors = [], onRefresh }) => {
  const [targetDoc, setTargetDoc] = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const handleToggle = async () => {
    setLoading(true);
    setError('');
    try {
      if (targetDoc.status) {
        await deactivateDoctor(targetDoc.id);
      } else {
        await reactivateDoctor(targetDoc.id);
      }
      setTargetDoc(null);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (doctors.length === 0) {
    return <p className="text-center text-gray-400 py-10 text-sm">No doctors found</p>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Specialization</th>
              <th className="px-4 py-3 text-left">Cabin</th>
              <th className="px-4 py-3 text-left">Fee</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {doctors.map((doc) => (
              <tr key={doc.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{doc.specialization}</td>
                <td className="px-4 py-3 text-gray-600">{doc.cabin}</td>
                <td className="px-4 py-3 text-gray-600">₹{doc.fee}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.status ? 'active' : 'inactive'} />
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant={doc.status ? 'danger' : 'success'}
                    onClick={() => { setTargetDoc(doc); setError(''); }}
                  >
                    {doc.status ? ' Deactivate' : ' Reactivate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm modal */}
      <Modal
        isOpen={!!targetDoc}
        onClose={() => setTargetDoc(null)}
        title={targetDoc?.status ? 'Deactivate Doctor' : 'Reactivate Doctor'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setTargetDoc(null)}>Cancel</Button>
            <Button
              variant={targetDoc?.status ? 'danger' : 'success'}
              loading={loading}
              onClick={handleToggle}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to {targetDoc?.status ? 'deactivate' : 'reactivate'}{' '}
          <strong>{targetDoc?.name}</strong>?{' '}
          {targetDoc?.status
            ? 'They will be hidden from patient search.'
            : 'They will appear in patient search again.'}
        </p>
        {error && <div className="mt-3"><Alert type="error" message={error} /></div>}
      </Modal>
    </>
  );
};

export default DoctorTable;
