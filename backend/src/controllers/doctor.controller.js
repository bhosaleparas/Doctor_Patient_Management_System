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




const loginDoctor = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
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




const changePasswordDoctor = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const doctorId = req.doctor.id; 


    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 5) {
      return res.status(400).json({ message: 'New password must be at least 5 characters' });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });


    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }


    const isSame = await bcrypt.compare(newPassword, doctor.password);
    if (isSame) {
      return res.status(400).json({ message: 'New password cannot be same as current password' });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.doctor.update({
      where: { id: doctorId },
      data: { password: hashedPassword }
    });

    res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export {loginDoctor,changePasswordDoctor}