import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { protectDoctor } from "../middleware/doctor.auth.js";

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



// doctorAppointments,completeAppointment
const doctorAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor.id; //from protected doctor

    const { date, status } = req.body;

    const search = { doctorId };

    if (date) {
      search.date = new Date(date); // add date to search object
    }

    if (status) {
      const validateStatus = ["pending", "completed", "cancelled"];
      if (!validateStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status must be pending, completed or cancelled" });
      }
      search.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where:{id:parseInt(doctorId)},
      orderBy: [{ date: "asc" }, { slot: { startTime: "asc" } }],
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            gender: true,
          },
        },
        slot: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    const formatted = appointments.map(a => ({
      id         : a.id,
      patientName: a.name,
      patientAge : a.patientAge,
      date       : a.date,
      slot       : `${a.slot.startTime} - ${a.slot.endTime}`,
      status     : a.status,
      user       : a.user
    }));

    res.status(200).json({
      total       : formatted.length,
      appointments: formatted
    });


  } catch (error) {
    console.log("Something wrong", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



//mark appointment
const markAppointmentCompleted = async (req, res) => {
  try {
    const doctorId = req.doctor.id;  // from doctorProtect middleware
    const { id } = req.params;        // appointment id

    // Find appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        slot: {
          select: { startTime: true, endTime: true, date: true }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }


    //Check appointment belongs to this doctor
    if (appointment.doctorId !== doctorId) {
      return res.status(403).json({ message: "Not authorized" });
    }


    // Check appointment is not already completed
    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Appointment is already completed" });
    }

    //Check appointment is not cancelled
    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Cannot complete a cancelled appointment" });
    }


    // Check appointment time has actually passed
    const now = new Date();
    const slotDateTime = new Date(appointment.slot.date);
    const [hours, minutes] = appointment.slot.endTime.split(":").map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);

    if (slotDateTime > now) {
      return res.status(400).json({
        message: `Cannot mark as completed before appointment ends at ${appointment.slot.endTime}`
      });
    }

    //Mark as completed
    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status: "completed" },
      include: {
        user: { select: { name: true, email: true } },
        slot: { select: { startTime: true, endTime: true } }
      }
    });

    res.status(200).json({
      message: "Appointment marked as completed",
      appointment: {
        id          : updated.id,
        patientName : updated.name,
        date        : updated.date,
        slot        : `${updated.slot.startTime} - ${updated.slot.endTime}`,
        status      : updated.status,
        user        : updated.user
      }
    });

  } catch (error) {
    console.error("Mark completed error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export { changePasswordDoctor,doctorAppointments,markAppointmentCompleted };
