import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const HospitalCard = ({ hospital }) => {
  const navigate = useNavigate();

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
    
    {/* header */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl flex-shrink-0">
          🏥
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-base leading-tight">
            {hospital.name}
          </h3>
          <p className="text-sm text-teal-600 font-medium">{hospital.city}</p>
        </div>
      </div>


      {/* info */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-gray-400 text-xs">Doctors</p>
          <p className="font-medium text-gray-700">
            {hospital._count?.doctors ?? '—'}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-gray-400 text-xs">Pincode</p>
          <p className="font-medium text-gray-700">{hospital.pincode}</p>
        </div>
      </div>

      {/* address */}
      <p className="text-xs text-gray-400 flex items-start gap-1">
        📍 {hospital.address}, {hospital.city}
      </p>

      {/* contact */}
      <p className="text-xs text-gray-400 flex items-center gap-1">
        :telephone_receiver: {hospital.phone}
      </p>

      {/* action */}
      <Button
        className="w-full mt-auto"
        onClick={() => navigate(`/hospital/${hospital.slug}`)}
      >
        View Doctors
      </Button>
    </div>
  );
};

export default HospitalCard;
