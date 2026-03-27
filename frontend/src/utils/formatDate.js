// Format date: "2026-03-20T00:00:00.000Z" → "20 Mar 2026"
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day  : 'numeric',
    month: 'short',
    year : 'numeric',
  });
};


// Format time: "09:00" → "9:00 AM"
export const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

// Format slot: "09:00 - 09:20" → "9:00 AM - 9:20 AM"
export const formatSlot = (slotStr) => {
  if (!slotStr) return '—';
  const [start, end] = slotStr.split(' - ');
  return `${formatTime(start)} - ${formatTime(end)}`;
};

// Get today's date as YYYY-MM-DD string
export const todayString = () => {
  return new Date().toISOString().split('T')[0];
};
