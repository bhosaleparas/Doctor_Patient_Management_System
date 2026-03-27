import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const features = [
  { icon: '🏥', title: 'Find Hospitals',      desc: 'Browse hospitals near you by name or city' },
  { icon: '👨‍⚕️', title: 'Choose a Doctor',     desc: 'Filter by specialty, fee, gender and availability' },
  { icon: '📅', title: 'Book Instantly',       desc: 'Pick a date and slot that works for you' },
  { icon: '📋', title: 'Track Appointments',   desc: 'Full history with real-time status updates' },
];

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-teal-50">
    <Navbar />

    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
          Book Doctor Appointments <br />
          <span className="text-brand-600">Easily <span style={{ fontFamily: 'ui-sans-serif' }}>&</span> Quickly</span>
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
          Find hospitals near you, browse doctors by specialty, and book appointments in minutes.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/hospitals" className="btn-outline px-8 py-3 text-base">
            Find Hospitals
          </Link>
          <Link to="/register" className="btn-outline px-8 py-3 text-base">
            Create Account
          </Link>
        </div>
      </div>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Everything you need
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div key={f.title} className="card text-center hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>


    <section className="bg-primary-600 py-16 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
      <p className="text-primary-200 mb-8">Join thousands of patients who trust MediBook</p>
      <Link to="/register" className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-2xl hover:bg-primary-50 transition-colors">
        Create Your Account
      </Link>
    </section>

    <footer className="text-center text-xs text-gray-400 py-6">
      © 2026 MediBook. All rights reserved.
    </footer>
  </div>
);

export default Home;
