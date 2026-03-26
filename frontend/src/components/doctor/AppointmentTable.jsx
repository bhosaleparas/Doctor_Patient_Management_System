import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import { formatDate, formatTime } from '../../utils/formatDate';
import { markComplete, markNoShow } from '../../services/doctorService';


const AppointmentTable = ({ appointments = [], onRefresh }) => {
  const [actionId,  setActionId]  = useState(null);
  const [actionType,setActionType]= useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const openModal = (id, type) => { setActionId(id); setActionType(type); setError(''); };
  const closeModal = () => { setActionId(null); setActionType(''); setError(''); };

  const handleAction = async () => {
    setLoading(true);
    setError('');
    try {
      if (actionType === 'complete') await markComplete(actionId);
      if (actionType === 'noshow')   await markNoShow(actionId);
      closeModal();
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No appointments found
      </div>
    );
  }


  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Slot</th>
              <th className="px-4 py-3 text-left">Age</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appointments.map((a) => (
              <tr key={a.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{a.patientName}</p>
                  <p className="text-xs text-gray-400">{a.user?.phone}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(a.date)}</td>
                <td className="px-4 py-3 text-gray-600">
                  {formatTime(a.slot?.split(' - ')[0])} – {formatTime(a.slot?.split(' - ')[1])}
                </td>
                <td className="px-4 py-3 text-gray-600">{a.patientAge ?? '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  {a.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="success" onClick={() => openModal(a.id, 'complete')}>
                        Complete
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openModal(a.id, 'noshow')}>
                        No Show
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* confirm modal */}
      <Modal
        isOpen={!!actionId}
        onClose={closeModal}
        title={actionType === 'complete' ? 'Mark as Completed' : 'Mark as No Show'}
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button
              variant={actionType === 'complete' ? 'success' : 'outline'}
              loading={loading}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {actionType === 'complete'
            ? 'Are you sure you want to mark this appointment as completed?'
            : 'Mark this appointment as no show? The patient did not appear.'}
        </p>
        {error && <div className="mt-3"><Alert type="error" message={error} /></div>}
      </Modal>
    </>
  );
};


export default AppointmentTable;
