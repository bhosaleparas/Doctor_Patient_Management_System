

const generateSlots = (timeWindows) => {
  const slots = [];
  const SLOT_DURATION = 20; 

  for (const window of timeWindows) {
    const { startTime, endTime } = window;

    // Convert start and end time to total minutes
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let current = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;

    while (current + SLOT_DURATION <= end) {
      const slotStart = minutesToTime(current);
      const slotEnd = minutesToTime(current + SLOT_DURATION);
      slots.push({ startTime: slotStart, endTime: slotEnd });
      current += SLOT_DURATION;
    }
  }

  return slots;
};


// convert 
const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};


export {generateSlots};