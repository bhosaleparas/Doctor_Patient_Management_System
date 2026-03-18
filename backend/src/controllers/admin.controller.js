import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (adminId) => {
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username or Password Reuuired" });
    }

    //Check username
    const existingAdmin = await prisma.admin.findFirst({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Username Already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create doctor
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Return response
    const { password: _, ...doctorWithoutPassword } = admin;

    res.status(201).json({
      message: "Admin registered successfully",
      data: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("Admin register error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    console.log(username); //debug line

    // Find admin by username
    const admin = await prisma.admin.findFirst({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //Generate token
    const token = generateToken(admin.id);
    // console.log(token);      //debug line

    // Return
    const { password: _, ...adminWithoutPassword } = admin;

    res.status(200).json({
      message: "Login successful",
      token,
      admin: admin.username,
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



const registerDoctor = async (req, res) => {
  try {
    const {
      username,
      email,
      name,
      password,
      specialization,
      cabin,
      fee,
      gender,
    } = req.body;

    if (
      !username ||
      !email ||
      !name ||
      !password ||
      !specialization ||
      !cabin ||
      !fee ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Check if email or username
    const existingDoctor = await prisma.doctor.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingDoctor) {
      if (existingDoctor.email === email) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      if (existingDoctor.username === username) {
        return res.status(409).json({
          message: "Username already taken",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create doctor
    const doctor = await prisma.doctor.create({
      data: {
        username,
        email,
        name,
        password: hashedPassword,
        specialization,
        cabin,
        fee: parseFloat(fee),
        gender,
      },
    });


    // Return response
    const { password: _, ...doctorWithoutPassword } = doctor;

    res.status(201).json({
      message: "Doctor registered successfully",
      data: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
        password: doctor.password,
      },
    });
  } catch (error) {
    res.status(403).json({ message: "Access Denied" });
  }
};




export { registerAdmin, loginAdmin, registerDoctor };
