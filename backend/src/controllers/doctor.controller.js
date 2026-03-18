import { prisma } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const generateToken = (doctorId) => {
  return jwt.sign(
    { id: doctorId, role: 'doctor' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};




// const registerDoctor = async (req, res) => {
//   try {
//     const { username, email, name, password, specialization, cabin, fee, gender } = req.body;

//     if (!username || !email || !name || !password || !specialization || !cabin || !fee || !gender) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     //Check if email or username
//     const existingDoctor = await prisma.doctor.findFirst({
//       where: {
//         OR: [{ email }, { username }]
//       }
//     });

//     if (existingDoctor) {
//       return res.status(409).json({
//         message: existingDoctor.email === email
//           ? 'Email already registered'
//           : 'Username already taken'
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     //Create doctor
//     const doctor = await prisma.doctor.create({
//       data: {
//         username,
//         email,
//         name,
//         password: hashedPassword,
//         specialization,
//         cabin,
//         fee: parseFloat(fee),
//         gender,
//       }
//     });

//     // Return response
//     const { password: _, ...doctorWithoutPassword } = doctor;

//     res.status(201).json({
//       message: 'Doctor registered successfully',
//       data:{
//         id:doctor.id,
//         name:doctor.name,
//         specialization:doctor.specialization,
//         fee:doctor.fee,
//         status:doctor.status

//       }
//     });

//   } catch (error) {
//     console.error('Doctor register error:', error.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };





const loginDoctor = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find doctor by email
    const doctor = await prisma.doctor.findUnique({
      where: { username }
    });


    if (!doctor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    // Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    //Generate token
    const token = generateToken(doctor.id);

    // Return
    const { password: _, ...doctorWithoutPassword } = doctor;

    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (error) {
    console.error('Doctor login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const changePassword= async(req,res)=>{

};

export {loginDoctor}