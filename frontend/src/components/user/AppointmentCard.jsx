import { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import { formatDate, formatSlot } from '../../utils/formatDate';
import { cancelAppointment } from '../../services/userService';

const AppointmentCard = ({ appointment, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const canCancel = appointment.status === 'pending';

  const handleCancel = async () => {
    setLoading(true);
    setError('');
    try {
      await cancelAppointment(appointment.id);
      setShowModal(false);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow">
        {/* date */}
        <div className="flex-shrink-0 w-16 h-16 bg-primary-50 rounded-2xl flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-primary-700 leading-none">
            {new Date(appointment.date).getDate()}
          </span>
          <span className="text-xs text-primary-500">
            {new Date(appointment.date).toLocaleString('en', { month: 'short' })}
          </span>
        </div>

        {/* information of appointments */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800">{appointment.doctor?.name}</h3>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="text-sm text-primary-600">{appointment.doctor?.specialization}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            <span>🕐 {formatSlot(appointment.slot)}</span>
            <span>💰 ₹{appointment.doctor?.fee}</span>
            {appointment.patientAge && <span>👤 Age: {appointment.patientAge}</span>}
          </div>
        </div>

        {/* actions */}
        {canCancel && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowModal(true)}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* cancel confirmation modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Cancel Appointment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Keep it</Button>
            <Button variant="danger" loading={loading} onClick={handleCancel}>
              Yes, Cancel
            </Button>
          </>
        }
      >
        <p className="text-gray-600 text-sm">
          Are you sure you want to cancel your appointment with{' '}
          <strong>{appointment.doctor?.name}</strong> on{' '}
          <strong>{formatDate(appointment.date)}</strong>?
        </p>
        <p className="text-xs text-gray-400 mt-2">
          ⚠️ Cancellation is only allowed more than 2 hours before the appointment.
        </p>
        {error && <div className="mt-3"><Alert type="error" message={error} /></div>}
      </Modal>
    </>
  );
};

export default AppointmentCard;
