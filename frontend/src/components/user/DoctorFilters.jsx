import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import specializationOptions from '../../constants/specializationOptions'
import { genderOptions } from '../../constants/genderOptions';



const DoctorFilters = ({ filters, onChange, onSearch, onReset, loading }) => (
  <div className="card mb-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Input
        label="Search by name"
        placeholder="Dr. xyz..."
        value={filters.name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <Select
        label="Specialization"
        placeholder="All specializations"
        options={specializationOptions}
        value={filters.specialization}
        onChange={(e) => onChange('specialization', e.target.value)}
      />
      <Select
        label="Gender"
        placeholder="Any gender"
        options={genderOptions}
        value={filters.gender}
        onChange={(e) => onChange('gender', e.target.value)}
      />
      <Input
        label="Available on date"
        type="date"
        value={filters.date}
        onChange={(e) => onChange('date', e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />
    </div>
    <div className="flex gap-3 mt-4">
      <Button loading={loading} onClick={onSearch}>Search</Button>
      <Button variant="ghost" onClick={onReset}>Reset</Button>
    </div>
  </div>
);

export default DoctorFilters;
