import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



// change for password for doctor
const changePasswordDoctor = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const doctorId = req.doctor.id;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 5) {
      return res
        .status(400)
        .json({ message: "New password must be at least 5 characters" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSame = await bcrypt.compare(newPassword, doctor.password);
    if (isSame) {
      return res
        .status(400)
        .json({ message: "New password cannot be same as current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.doctor.update({
      where: { id: doctorId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { changePasswordDoctor };
