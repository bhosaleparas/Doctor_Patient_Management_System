import express from 'express';
import { connectDb, disconnectDb } from './src/config/db.js';
import userroutes from './src/routes/user.routes.js';
import doctorroutes from './src/routes/doctor.routes.js'
import adminroutes from './src/routes/admin.routes.js'
import hospitalroutes from './src/routes/hospital.routes.js'


const app = express();
app.use(express.json());

connectDb();

const PORT = 8000;

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