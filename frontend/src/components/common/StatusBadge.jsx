const badgeMap = {
  pending  : 'badge-pending',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
  no_show  : 'badge-no_show',
  active   : 'bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full',
  inactive : 'bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full',
};

const labelMap = {
  pending  : 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show  : 'No Show',
  active   : 'Active',
  inactive : 'Inactive',
};

const StatusBadge = ({ status }) => (
  <span className={badgeMap[status] || 'badge-pending'}>
    {labelMap[status] || status}
  </span>
);

export default StatusBadge;
