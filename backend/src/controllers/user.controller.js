import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";



// search Doctor
const searchDoctor = async (req, res) => {
  try {
    const { name, specialization } = req.query;

    const doctors = await prisma.doctor.findMany({
      where: {
        name: name ? { contains: name } : undefined,
        specialization: specialization ? { contains: specialization } : undefined,
      },
      select: {
        id: true,
        name: true,
        // email: true,
        specialization: true,
        // cabin: true,
        // fee: true,
        // gender: true,
        status: true,
        hospital: {
        select: {
          name: true
        }
      }
      }
    });

    res.json(doctors);
  } catch (error) {
    console.error("Search doctor error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        // username: true,
        email: true,
        name: true,
        specialization: true,
        cabin: true,
        fee: true,
        gender: true,
        status: true,
        // createdAt: true,
        // updatedAt: true,
        hospital: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true,
            phone: true
          }
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({ message: `Doctor with ID ${id} not found` });
    }

    res.status(200).json({
      message: "Doctor details fetched successfully",
      doctor
    });

  } catch (error) {
    console.error("Get doctor by ID error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};




const bookAppointment=async(req,res)=>{

};


const viewSlot=async(req,res)=>{

};


const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: {
        doctor: {
          select: { name: true, specialization: true, cabin: true, fee: true }
        },
        slot: {
          select: { startTime: true, endTime: true }
        }
      }
    });

    const formatted = appointments.map(a => ({
      id: a.id,
      name: a.name,
      date: a.date,
      slot: `${a.slot.startTime} - ${a.slot.endTime}`,
      status: a.status,
      patientAge: a.patientAge,
      doctor: a.doctor
    }));

    res.status(200).json({
      total: formatted.length,
      appointments: formatted
    });

  } catch (error) {
    console.error('Get user appointments error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// cancel appointment for user
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;   //apointment id

    //Find appointment with slot
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        slot: {
          select: { startTime: true, endTime: true }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check appointment belongs to this user
    if (appointment.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //Check appointment is not already cancelled or completed
    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Appointment already cancelled" });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed appointment" });
    }

    

    const appointmentDate = new Date(appointment.date);
    const [hours, minutes] = appointment.slot.startTime.split(":").map(Number);

    // Set exact appointment time
    appointmentDate.setHours(hours, minutes, 0, 0);

    const now = new Date();

    
    // Difference in milliseconds → convert to hours
    const diffInMs = appointmentDate.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);


    //Appointment Must be more than 2 hours away to cancel
    if (diffInHours <= 2) {
      return res.status(400).json({
        message: `Cancellation not allowed. Appointment is in ${ diffInHours <= 0 ? "the past"
            : `${Math.floor(diffInHours)}h ${Math.round((diffInHours % 1) * 60)}m` }. Must cancel at least 2 hours before.`
      });
    }

    // Cancel appointment
    await prisma.$transaction([
      prisma.appointment.update({
        where: { id: parseInt(id) },
        data: { status: "cancelled" }
      }),
      prisma.slot.update({
        where: { id: appointment.slotId },
        data: { isBooked: false }    // make slot free
      })
    ]);

    res.status(200).json({
      message: "Appointment cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel appointment error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export {searchDoctor,getDoctorById,bookAppointment,cancelAppointment,viewSlot,getUserAppointments};
