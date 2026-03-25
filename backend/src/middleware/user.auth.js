import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";



// middleware for protected user routes
const protectUser = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    const bearer = header.split(" ");
    const token = bearer[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true }
    });

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};



export {protectUser};