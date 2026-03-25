import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PageWrapper from '../../components/common/PageWrapper';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import SlotPicker from '../../components/user/SlotPicker';
import Loader from '../../components/common/Loader';
import useFetch from '../../hooks/useFetch';
import { getDoctorById, getAvailableSlots, bookAppointment } from '../../services/userService';
import { todayString, formatTime } from '../../utils/formatDate';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate     = useNavigate();

  const { data: doctorData, loading: docLoading } = useFetch(() => getDoctorById(doctorId));
  const doctor = doctorData?.doctor || doctorData;

  const [date,         setDate]         = useState('');
  const [slots,        setSlots]        = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [name,         setName]         = useState('');
  const [patientAge,   setPatientAge]   = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');

  const handleDateChange = async (val) => {
    setDate(val);
    setSelectedSlot(null);
    setError('');
    if (!val) return;
    setSlotsLoading(true);
    try {
      const res = await getAvailableSlots(doctorId, val);
      setSlots(res.data?.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return setError('Please select a time slot');
    setSubmitting(true);
    setError('');
    try {
      await bookAppointment({
        slotId    : selectedSlot.id,
        name,
        patientAge: patientAge || undefined,
      });
      setSuccess('Appointment booked successfully! Redirecting...');
      setTimeout(() => navigate('/my-appointments'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (docLoading) return <div className="min-h-screen bg-gray-50"><Navbar /><Loader /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper title="Book Appointment">
        <div className="max-w-2xl mx-auto">
          {/* Doctor summary */}
          {doctor && (
            <div className="card mb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0">
                {doctor.gender === 'F' ? '👩‍⚕️' : '👨‍⚕️'}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-sm text-primary-600">{doctor.specialization}</p>
                <p className="text-xs text-gray-400 mt-0.5">₹{doctor.fee} consultation fee</p>
              </div>
            </div>
          )}

          <div className="card shadow-md">
            <form onSubmit={handleBook} className="flex flex-col gap-6">
              {/* Step 1: Pick Date */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">1. Select Date</h3>
                <Input
                  type="date"
                  value={date}
                  min={todayString()}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                />
              </div>

              {/* Step 2: Pick Slot */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">
                  2. Select Time Slot
                  {date && <span className="text-xs text-gray-400 ml-2 font-normal">({slots.length} available)</span>}
                </h3>
                {slotsLoading ? (
                  <Loader text="Loading slots..." />
                ) : date ? (
                  <SlotPicker
                    slots={slots}
                    selectedSlot={selectedSlot}
                    onSelect={setSelectedSlot}
                  />
                ) : (
                  <p className="text-sm text-gray-400">Please select a date first</p>
                )}
                {selectedSlot && (
                  <p className="mt-3 text-sm text-green-600 font-medium">
                    ✅ Selected: {formatTime(selectedSlot.startTime)} – {formatTime(selectedSlot.endTime)}
                  </p>
                )}
              </div>

              {/* Step 3: Patient info */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">3. Patient Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Patient Name"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Age (optional)"
                    type="number"
                    placeholder="25"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    min="1"
                    max="120"
                  />
                </div>
              </div>

              {error   && <Alert type="error"   message={error} />}
              {success && <Alert type="success" message={success} />}

              <Button
                type="submit"
                loading={submitting}
                disabled={!selectedSlot || !name}
                className="w-full"
              >
                Confirm Booking
              </Button>
            </form>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default BookAppointment;
