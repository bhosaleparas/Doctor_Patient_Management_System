import { formatTime } from '../../utils/formatDate';

const SlotPicker = ({ slots = [], selectedSlot, onSelect }) => {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No available slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;
        return (
          <button
            key={slot.id}
            onClick={() => onSelect(slot)}
            className={`
              px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-150
              ${isSelected
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:text-primary-600'
              }
            `}
          >
            {formatTime(slot.startTime)}
          </button>
        );
      })}
    </div>
  );
};

export default SlotPicker;
