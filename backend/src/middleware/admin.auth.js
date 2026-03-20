import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";



const Protectadmin = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const bearer = header.split(" ");
    const token = bearer[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    // console.log(decoded.role);
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });
    // console.log(admin)
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};


export { Protectadmin };
