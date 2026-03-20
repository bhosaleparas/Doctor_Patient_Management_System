import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";


const protectDoctor = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    // console.log(header);
    const bearer = header.split(" ");
    const token = bearer[1];
    // console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    if (decoded.role !== "doctor") {
      return res.status(403).json({ message: "Not authorized as doctor" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, status: true, hospitalId: true },
    });
    
    console.log(doctor.email)
    console.log(doctor.hospitalId)
    if (!doctor) {
      return res.status(401).json({ message: "Doctor not found" });
    }

    if (!doctor.status) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};



export { protectDoctor };
