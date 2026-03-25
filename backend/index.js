import express from 'express';
import { connectDb, disconnectDb } from './src/config/db.js';
import userroutes from './src/routes/user.routes.js';
import doctorroutes from './src/routes/doctor.routes.js'
import adminroutes from './src/routes/admin.routes.js'
import hospitalroutes from './src/routes/hospital.routes.js'
import cors from 'cors';

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true 
};

connectDb();

const PORT = 8000;

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Well Come to Hospitale!');
});

app.use('/user', userroutes);
app.use('/doctor', doctorroutes);
app.use('/admin', adminroutes);
app.use('/hospital',hospitalroutes);



app.listen(PORT, () => {
  console.log(`server listening running on port ${PORT}`);
});