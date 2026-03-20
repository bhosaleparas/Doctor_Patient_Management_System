import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Token generation 
const generateToken = (doctorId,hospitalId) => {
  return jwt.sign({ id: doctorId,hospitalId:hospitalId, role: "doctor" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};


// Login doctor
const loginDoctor = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find doctor by username
    const doctor = await prisma.doctor.findUnique({
      where: { username },
    });


    if (!doctor) {
      return res.status(401).json({ message: "Invalid username or password" }); // Fixed: was "email"
    }


    // Compare password
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" }); // Fixed: was "email"
    }

    // Token generation
    const token = generateToken(doctor.id,doctor.hospitalId);


    // Return doctor data without password
    const { password: _, ...doctorWithoutPassword } = doctor;

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("Doctor login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { loginDoctor };