import { prisma } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// token generation
const generateToken = (adminId) => {
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};


// register admin
const registerAdmin = async (req, res) => {
  try {
    const { username, password,hospitalId } = req.body;

    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and Password are required" });
    }

    // check hospital exists or not
    const hospital = await prisma.hospital.findUnique({
      where: { id: parseInt(hospitalId) }
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }


    // Check username
    const existingAdmin = await prisma.admin.findFirst({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(409).json({
        message: "Username already taken", 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin 
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        hospitalId: parseInt(hospitalId)
      }
    });


    // Response data
    const { password: _, ...adminWithoutPassword } = admin;

    res.status(201).json({
      message: "Admin registered successfully",
      data:adminWithoutPassword
    });

  } catch (error) {
    console.error("Admin register error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



// login admin
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username or password or hospitalId are required" }); 
    }


    // Find admin by username
    const admin = await prisma.admin.findFirst({
      where: { username },
    });



    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" }); // Fixed: was "email"
    }
    

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" }); // Fixed: was "email"
    }


    // Generate token
    const token = generateToken(admin.id);

    // Response data
    const { password: _, ...adminWithoutPassword } = admin;

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id        : admin.id,
        username  : admin.username,
        hospitalId: admin.hospitalId,   
        hospital  : admin.hospital, 
      }
    });
    
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export {registerAdmin,loginAdmin,};