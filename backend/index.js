import express from 'express';
import { connectDb, disconnectDb } from './src/config/db.js';
import userroutes from './src/routes/user.routes.js';
import doctorroutes from './src/routes/doctor.routes.js';
import adminroutes from './src/routes/admin.routes.js';
import hospitalroutes from './src/routes/hospital.routes.js';
import cors from 'cors';

const app = express();

// Parse JSON
app.use(express.json());

// Allow multiple origins (local + Netlify)
const allowedOrigins = [
  'http://localhost:5173',
  'https://hospital-doctor-patient.netlify.app'
];

const corsOptions = {
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Connect to database
connectDb();

const PORT = process.env.PORT || 8000;

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to Hospital!');
});

// API routes
app.use('/user', userroutes);
app.use('/doctor', doctorroutes);
app.use('/admin', adminroutes);
app.use('/hospital', hospitalroutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});