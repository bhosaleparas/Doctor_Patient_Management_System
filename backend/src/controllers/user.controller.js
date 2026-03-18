import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import jwt from 'jsonwebtoken';



// token generation
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};





const registerUser = async (req, res) => {
  const { name, email, password, phone, dob, gender, city, address, pincode } =
    req.body;

  // console.log(name)
  // console.log(password)

  const checkUser = await prisma.User.findUnique({ where: { email } });


  // console.log(email)

  if (checkUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  console.log(hashPassword);

  const user = await prisma.User.create({
    data: {
      name,
      email,
      password: hashPassword,
      phone,
      dob: new Date(dob),
      gender,
      city,
      address,
      pincode: parseInt(pincode),
    },
  });

  res.status(201).json({
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
};


// LOGIN 

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // check user
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return token
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export { registerUser, loginUser };
