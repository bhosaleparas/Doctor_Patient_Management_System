import { useState } from 'react';
import { formatTime } from '../../utils/formatDate';
import { blockSlot, unblockSlot } from '../../services/doctorService';

const SlotCalendar = ({ slots = [], onRefresh }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [error,     setError]     = useState('');

  const handleToggleBlock = async (slot) => {
    // cannot block a booked slot
    if (slot.isBooked) return;

    setLoadingId(slot.id);
    setError('');
    try {
      if (slot.isBlocked) {
        await unblockSlot(slot.id);
      } else {
        await blockSlot(slot.id);
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setLoadingId(null);
    }
  };

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No slots generated yet for this date
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="text-xs text-red-500 mb-3">{error}</p>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {slots.map((slot) => {
          const isLoading = loadingId === slot.id;

          return (
            <div
              key={slot.id}
              className={`
                rounded-xl border text-center px-2 py-2 text-xs font-medium transition-all
                ${slot.isBooked  ? 'bg-red-50   text-red-500   border-red-200'  : ''}
                ${slot.isBlocked && !slot.isBooked ? 'bg-gray-100 text-gray-400 border-gray-200' : ''}
                ${!slot.isBooked && !slot.isBlocked ? 'bg-green-50 text-green-700 border-green-200' : ''}
              `}
            >
              {/* time */}
              <p className="font-semibold">{formatTime(slot.startTime)}</p>
              <p className="text-[10px] opacity-70 mt-0.5">
                {slot.isBooked ? 'Booked' : slot.isBlocked ? 'Blocked' : 'Open'}
              </p>

              {/* block / unblock button — only for non-booked slots */}
              {!slot.isBooked && (
                <button
                  onClick={() => handleToggleBlock(slot)}
                  disabled={isLoading}
                  className={`
                    mt-1.5 w-full text-[10px] px-1 py-0.5 rounded-lg border transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${slot.isBlocked
                      ? 'border-green-300 text-green-600 hover:bg-green-50'
                      : 'border-red-300   text-red-500   hover:bg-red-50'
                    }
                  `}
                >
                  {isLoading
                    ? '...'
                    : slot.isBlocked
                      ? 'Unblock'
                      : 'Block'
                  }
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* summary */}
      <div className="flex gap-4 mt-4 text-xs text-gray-400">
        <span>🟢 Open: {slots.filter(s => !s.isBooked && !s.isBlocked).length}</span>
        <span>🔴 Booked: {slots.filter(s => s.isBooked).length}</span>
        <span>⚫ Blocked: {slots.filter(s => s.isBlocked).length}</span>
        <span>Total: {slots.length}</span>
      </div>
    </div>
  );
};

export default SlotCalendar;
