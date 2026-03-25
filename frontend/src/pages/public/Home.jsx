import { Link } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

const features = [
  {
    icon: "🏥",
    title: "Find Hospitals",
    desc: "Browse hospitals near you by name or city",
  },
  {
    icon: "👨‍⚕️",
    title: "Choose a Doctor",
    desc: "Filter by specialty, fee, gender and availability",
  },
  {
    icon: "📅",
    title: "Book Instantly",
    desc: "Pick a date and slot that works for you",
  },
  {
    icon: "📋",
    title: "Track Appointments",
    desc: "Full history with real-time status updates",
  },
];

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-teal-50">
    <Navbar />

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-6        tracking-wide uppercase">
        Doctor–Patient Management System
      </div>

      <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Your health,
        <br />
        <span className="text-primary-600">simplified.</span>
      </h1>

      <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
        Book appointments with top doctors, manage your health records, and
        never miss a slot again.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="btn-primary text-base px-8 py-3 rounded-2xl"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="btn-outline text-base px-8 py-3 rounded-2xl"
        >
          Sign In
        </Link>
      </div>


      <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
        {[
          ["500+", "Doctors"],
          ["10k+", "Patients"],
          ["50k+", "Appointments"],
        ].map(([num, label]) => (
          <div key={label}>
            <p className="text-2xl font-bold text-primary-700">{num}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>


    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Everything you need
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="card text-center hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>



    <section className="bg-primary-600 py-16 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">
        Ready to take control of your health?
      </h2>
      <p className="text-primary-200 mb-8">
        Join thousands of patients who trust MediBook
      </p>
      <Link
        to="/register"
        className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-2xl hover:bg-primary-50 transition-colors"
      >
        Create Your Account
      </Link>
    </section>


    <footer className="text-center text-xs text-gray-400 py-6">
      © 2026 MediBook. All rights reserved.
    </footer>
  </div>
);

export default Home;
