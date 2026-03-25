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


//get all doctors of hospital by admin
const getAllDoctors = async (req, res) => {
  try {
    
    const adminId = req.admin.id;

    // get hospital id of admin
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { hospitalId: true },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // get all doctors of admin hospital
    const doctors = await prisma.doctor.findMany({
      where: { hospitalId: admin.hospitalId, status:true},
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        // email: true,
        // phone: true,
        cabin:true,
        fee:true,
        specialization: true,
        status: true,
        // hospitalId: true,
      },
    });

    res.status(200).json({ total: doctors.length, doctors });
  } catch (err) {
    console.error("Get all doctors error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



// admin analytics
const getAnalytics = async (req, res) => {
  try {
    // admin id from protected route
    const adminId = req.admin.id;

    // hospital id from admin's id
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { hospitalId: true }
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const hospitalId = admin.hospitalId;


    
    const patients = await prisma.appointment.findMany({
      where: {
        doctor: {
          hospitalId
        }
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    });

    const totalPatients = patients.length;
    //active doctors from hospital id
    const activeDoctors = await prisma.doctor.count({
      where: {
        hospitalId,
        status: true
      }
    });

    // total appointments from doctor
    const totalAppointments = await prisma.appointment.count({
      where: {
        doctor: {
          hospitalId
        }
      }
    });

    const cancelledAppointments = await prisma.appointment.count({
      where: {
        status: "cancelled",
        doctor: {
          hospitalId
        }
      }
    });

    const cancellationRate = totalAppointments
      ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1) + "%"
      : "0%";


    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const appointments = await prisma.appointment.findMany({
      where: {
        createdAt: { gte: last30Days },
        doctor: {
          hospitalId
        }
      },
      select: { createdAt: true }
    });

    const dateMap = {};

    appointments.forEach((a) => {
      const date = a.createdAt.toISOString().split("T")[0];
      dateMap[date] = (dateMap[date] || 0) + 1;
    });

    const appointmentsOverTime = Object.keys(dateMap)
      .map((date) => ({
        date,
        count: dateMap[date]
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    
      //most booked doctors
    const doctorBookings = await prisma.appointment.groupBy({
      by: ["doctorId"],
      where: {
        doctor: {
          hospitalId
        }
      },
      _count: {
        doctorId: true
      },
      orderBy: {
        _count: {
          doctorId: "desc"
        }
      },
      take: 5
    });

    const doctorIds = doctorBookings.map(d => d.doctorId);

    const doctors = await prisma.doctor.findMany({
      where: {
        id: { in: doctorIds }
      },
      select: {
        id: true,
        name: true,
        specialization: true
      }
    });

    const doctorMap = {};
    doctors.forEach(d => {
      doctorMap[d.id] = d;
    });

    const mostBookedDoctors = doctorBookings.map(d => ({
      doctorId: d.doctorId,
      totalBookings: d._count.doctorId,
      doctor: doctorMap[d.doctorId] || null
    }));

    
    //booking by speciality
    const specialtyMap = {};

    mostBookedDoctors.forEach((d) => {
      const spec = d.doctor?.specialization;
      if (!spec) return;

      specialtyMap[spec] = (specialtyMap[spec] || 0) + d.totalBookings;
    });

    const mostBookedSpecialty = Object.keys(specialtyMap).map(spec => ({
      specialty: spec,
      count: specialtyMap[spec]
    }));

    
    //final responce
    res.status(200).json({
      overview: {
        totalPatients, 
        activeDoctors,
        totalAppointments,
        cancelledAppointments,
        cancellationRate
      },
      appointmentsOverTime,
      mostBookedSpecialty,
      mostBookedDoctors
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



//reactivate doctor
const reactivateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({ where: { id: parseInt(id) } });
    if (!doctor)       return res.status(404).json({ message: 'Doctor not found' });
    if (doctor.status) return res.status(400).json({ message: 'Doctor is already active' });

    await prisma.doctor.update({
      where: { id: parseInt(id) },
      data : { status: true }
    });

    res.status(200).json({ message: 'Doctor reactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id       : true, name     : true,
        email    : true, phone    : true,
        city     : true, gender   : true,
        createdAt: true
      }
    });
    res.status(200).json({ total: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


export {registerDoctor, deactivateDoctor,getAllDoctors, getAnalytics, reactivateDoctor, getAllUsers };
