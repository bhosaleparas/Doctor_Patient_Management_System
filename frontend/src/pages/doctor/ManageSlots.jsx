import { useState } from "react";
import Navbar from "../../components/common/Navbar";
import PageWrapper from "../../components/common/PageWrapper";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import SlotCalendar from "../../components/doctor/SlotCalendar";
import Loader from "../../components/common/Loader";
import { setAvailability, getDoctorSlots } from "../../services/doctorService";
import { todayString } from "../../utils/formatDate";

const defaultWindow = { startTime: "", endTime: "" };

const ManageSlots = () => {
  const [date, setDate] = useState("");
  const [windows, setWindows] = useState([defaultWindow ]);
  const [slots, setSlots] = useState([]);
  const [viewDate, setViewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  

  // Add a new time window row
  const addWindow = () => setWindows((prev) => [...prev, { ...defaultWindow }]);

  // Remove a time window row
  const removeWindow = (idx) =>
    setWindows((prev) => prev.filter((_, i) => i !== idx));

  // Update a specific window field
  const updateWindow = (idx, field, value) =>
    setWindows((prev) =>
      prev.map((w, i) => (i === idx ? { ...w, [field]: value } : w)),
    );

  // Generate slots
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await setAvailability({ date, timeWindows: windows });
      setSuccess(`${res.data.totalSlots} slots generated successfully!`);
      // Auto show generated slots in view panel
      setViewDate(date);
      const slotsRes = await getDoctorSlots({ date });
      setSlots(slotsRes.data?.slots || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate slots");
    } finally {
      setLoading(false);
    }
  };

  // View slots for a date — accepts optional override date for auto-refresh
  const handleViewSlots = async (overrideDate) => {
    const targetDate = overrideDate || viewDate;
    if (!targetDate) return;
    setViewLoading(true);
    try {
      const res = await getDoctorSlots({ date: targetDate });
      setSlots(res.data?.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setViewLoading(false);
    }
  };

  // Called by SlotCalendar after block/unblock to refresh the list
  const handleSlotRefresh = () => handleViewSlots(viewDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageWrapper
        title="Manage Slots"
        subtitle="Set your availability and generate appointment slots"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generate slots form */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Set Availability
            </h2>
            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              <Input
                label="Date"
                type="date"
                value={date}
                min={todayString()}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              {/* Time windows */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Time Windows
                </label>
                <div className="flex flex-col gap-3">
                  {windows.map((w, idx) => (
                    <div key={idx} className="flex items-end gap-2">
                      <Input
                        label="Start"
                        type="time"
                        value={w.startTime}
                        onChange={(e) =>
                          updateWindow(idx, "startTime", e.target.value)
                        }
                        required
                      />
                      <Input
                        label="End"
                        type="time"
                        value={w.endTime}
                        onChange={(e) =>
                          updateWindow(idx, "endTime", e.target.value)
                        }
                        required
                      />
                      {windows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeWindow(idx)}
                          className="mb-1 text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addWindow}
                  className="mt-3 text-sm text-primary-600 hover:underline"
                >
                  + Add another time window
                </button>
                <p className="text-xs text-gray-400 mt-1">
                  Each slot = 30 minutes. e.g. 09:00–10:00 generates 2 slots.
                </p>
              </div>

              {error && <Alert type="error" message={error} />}
              {success && <Alert type="success" message={success} />}

              <Button type="submit" loading={loading}>
                Generate Slots
              </Button>
            </form>
          </div>

          {/* View slots */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              View <span style={{ fontFamily: "ui-sans-serif" }}>&</span> Manage Slots
            </h2>
            <div className="flex gap-3 mb-5">
              <Input
                type="date"
                value={viewDate}
                min={todayString()}
                onChange={(e) => setViewDate(e.target.value)}
              />
              <Button onClick={() => handleViewSlots()} loading={viewLoading}>
                View
              </Button>
            </div>

            {viewLoading ? (
              <Loader />
            ) : (
              <SlotCalendar slots={slots} onRefresh={handleSlotRefresh} />
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default ManageSlots;
