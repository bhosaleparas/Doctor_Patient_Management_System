import { formatTime } from '../../utils/formatDate';

const SlotCalendar = ({ slots = [] }) => {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No slots generated yet for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className={`
            px-3 py-2 rounded-xl text-xs font-medium text-center border
            ${slot.isBooked  ? 'bg-red-50   text-red-500   border-red-200'   : ''}
            ${slot.isBlocked ? 'bg-gray-100 text-gray-400  border-gray-200'  : ''}
            ${!slot.isBooked && !slot.isBlocked ? 'bg-green-50 text-green-700 border-green-200' : ''}
          `}
        >
          <p>{formatTime(slot.startTime)}</p>
          <p className="text-[10px] mt-0.5 opacity-70">
            {slot.isBooked ? 'Booked' : slot.isBlocked ? 'Blocked' : 'Open'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SlotCalendar;
