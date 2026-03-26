import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';  // ← add

const DoctorCard = ({ doctor }) => {
  const navigate    = useNavigate();
  const { user }    = useAuth();          // ← add
  const isLoggedIn  = !!user;             // ← add

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
      {/* header  */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0">
          {doctor.gender === 'Female' ? '👩‍⚕️' : '👨‍⚕️'}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-base leading-tight">
            {doctor.name}
          </h3>
          <p className="text-sm text-primary-600 font-medium">
            {doctor.specialization}
          </p>
        </div>
      </div>

      {/* Info of doctors */}
      {isLoggedIn ? (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-gray-400 text-xs">Cabin</p>
            <p className="font-medium text-gray-700">{doctor.cabin}</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-gray-400 text-xs">Fee</p>
            <p className="font-medium text-gray-700">₹{doctor.fee}</p>
          </div>
        </div>
      ) : (

        // non logged users  see a blurred
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 rounded-lg px-3 py-2 relative">
            <p className="text-gray-400 text-xs">Cabin</p>
            <p className="font-medium text-gray-300 blur-sm select-none">A-101</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-2 relative">
            <p className="text-gray-400 text-xs">Fee</p>
            <p className="font-medium text-gray-300 blur-sm select-none">₹500</p>
          </div>
        </div>
      )}

      {/* Hospital visible always */}
      {doctor.hospital && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          🏥 {doctor.hospital.name}, {doctor.hospital.city}
        </p>
      )}

      {/* bottom action */}
      <div className="flex items-center justify-between mt-auto">
        <span className={`text-xs font-medium px-2 py-1 rounded-full
          ${doctor.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {doctor.status ? '● Available' : '● Inactive'}
        </span>

        {/* Logged in then book button else guest login  */}
        {isLoggedIn ? (
          <Button
            size="sm"
            onClick={() => navigate(`/doctors/${doctor.id}`)}
            disabled={!doctor.status}
          >
            View & Book
          </Button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-xs text-primary-600 font-medium hover:underline"
          >
            Login to book →
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;