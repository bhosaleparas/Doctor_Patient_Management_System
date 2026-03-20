import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";






// register doctor
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
      hospitalId
    } = req.body;

    if (
      !username ||
      !email ||
      !name ||
      !password ||
      !specialization ||
      !cabin ||
      !fee ||
      !gender ||
      !hospitalId
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
        hospitalId: parseInt(hospitalId)
      },
    });

    //response data
    const { password: _, ...doctorWithoutPassword } = doctor;

    res.status(201).json({
      message: "Doctor registered successfully",
      data: {
        id: doctor.id,
        name: doctor.name,
        specialization: doctor.specialization,
      },
    });
  } catch (error) {
    res.status(403).json({ message: "Access Denied" });
  }
};




// control doctor
const deactivateDoctor = async (req, res) => {
  try {
    console.log(req.params.id);
    const doctor_id = req.params.id;
    console.log(doctor_id);

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctor_id) },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor does not exist" });
    }

    // Deactivate doctor
    await prisma.doctor.update({
      where: { id: parseInt(doctor_id) },
      data: { status: false },
    });

    res.status(200).json({ message: "Doctor deactivated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {registerDoctor, deactivateDoctor };
