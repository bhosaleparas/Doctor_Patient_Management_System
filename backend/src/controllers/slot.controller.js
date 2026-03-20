import { prisma } from "../config/db.js";
import { generateSlots } from "../../utils/slotGenerator.js";

const setAvailability = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const hospitalId = req.doctor.hospitalId;
    const { date, timeWindows } = req.body;

    //Check request data
    if (!date || !timeWindows || timeWindows.length === 0) {
      return res
        .status(400)
        .json({ message: "Date and timeWindows are required" });
    }

    const parsedDate = new Date(date);
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(parsedDate);
    selectedDate.setHours(0, 0, 0, 0);

    //Reject past dates entirely
    if (selectedDate < today) {
      return res.status(400).json({
        message: "Cannot create slots for past dates",
      });
    }

    //check each time window is in the future
    if (selectedDate.getTime() === today.getTime()) {
      for (const window of timeWindows) {
        const [windowHour, windowMin] = window.startTime.split(":").map(Number);

        const windowDateTime = new Date();
        windowDateTime.setHours(windowHour, windowMin, 0, 0);

        if (windowDateTime <= now) {
          return res.status(400).json({
            message: `Time window ${window.startTime} - ${window.endTime} is in the past. Only future time windows allowed for today`,
          });
        }
      }
    }

    for (const window of timeWindows) {
      if (!window.startTime || !window.endTime) {
        return res.status(400).json({
          message: "Each window must have startTime and endTime",
        });
      }
      if (window.startTime >= window.endTime) {
        return res.status(400).json({
          message: `Invalid window: ${window.startTime} - ${window.endTime}`,
        });
      }
    }

    //Check if availability already exists for this date
    const existing = await prisma.doctorAvailability.findUnique({
      where: { doctorId_date: { doctorId, date: parsedDate } },
    });

    if (existing) {
      await prisma.slot.deleteMany({
        where: { availabilityId: existing.id, isBooked: false },
      });
      await prisma.doctorAvailability.delete({ where: { id: existing.id } });
    }

    //Create availability
    const availability = await prisma.doctorAvailability.create({
      data: { doctorId, hospitalId, date: parsedDate },
    });

    //Generate and save slots
    const generatedSlots = generateSlots(timeWindows);

    await prisma.slot.createMany({
      data: generatedSlots.map((slot) => ({
        doctorId,
        availabilityId: availability.id,
        date: parsedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    });

    //Return created slots
    const slots = await prisma.slot.findMany({
      where: { availabilityId: availability.id },
      orderBy: { startTime: "asc" },
    });

    res.status(201).json({
      message: `${slots.length} slots generated successfully`,
      date,
      timeWindows,
      totalSlots: slots.length,
      slots,
    });
  } catch (error) {
    console.error("Set availability error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Doctor can view own slots
const getDoctorSlots = async (req, res) => {
  try {
    const doctorId = req.doctor.id;
    const { date } = req.query; // date in yyyy-mm-dd

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const slots = await prisma.slot.findMany({
      where: { doctorId, date: new Date(date) },
      orderBy: { startTime: "asc" },
    });

    const summary = {
      total: slots.length,
      available: slots.filter((s) => !s.isBooked && !s.isBlocked).length,
      booked: slots.filter((s) => s.isBooked).length,
      blocked: slots.filter((s) => s.isBlocked).length,
    };

    res.status(200).json({ date, summary, slots });
  } catch (error) {
    console.error("Get doctor slots error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAvailableSlotsForUser = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // enter in yyyy-mm-dd

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // return slots that are not booked and not blocked
    const slots = await prisma.slot.findMany({
      where: {
        doctorId: parseInt(doctorId),
        date: new Date(date),
        isBooked: false,
        isBlocked: false,
      },
      orderBy: { startTime: "asc" },
    });

    res.status(200).json({
      doctorId: parseInt(doctorId),
      date,
      availableSlots: slots.length,
      slots,
    });
  } catch (error) {
    console.error("Get available slots error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User can book slot
const bookSlot = async (req, res) => {
  try {
    const userId = req.user.id; // from protectUser middleware
    const { slotId, name, patientAge } = req.body;

    if (!slotId || !name || !patientAge) {
      return res
        .status(400)
        .json({ message: "slotId or name or patientAge are required" });
    }

    // find slot
    const slot = await prisma.slot.findUnique({
      where: { id: parseInt(slotId) },
      include: { doctor: true },
    });

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check slot available or not
    if (slot.isBooked) {
      return res.status(400).json({ message: "Slot is already booked" });
    }

    if (slot.isBlocked) {
      return res.status(400).json({ message: "Slot is not available" });
    }

    // Check if user already booked same doctor same day
    const alreadyBooked = await prisma.appointment.findFirst({
      where: {
        userId,
        doctorId: slot.doctorId,
        date: slot.date,
      },
    });

    if (alreadyBooked) {
      return res
        .status(400)
        .json({
          message:
            "You already have an appointment with this doctor on this day",
        });
    }

    //Create appointment and mark slot as booked
    try {
      const [appointment] = await prisma.$transaction([
        prisma.appointment.create({
          data: {
            userId,
            doctorId: slot.doctorId,
            slotId: slot.id,
            name,
            date: slot.date,
            patientAge: patientAge ? parseInt(patientAge) : null,
          },
        }),
        prisma.slot.update({
          where: { id: slot.id },
          data: { isBooked: true },
        }),
      ]);

      
      res.status(201).json({
        message: "Appointment booked successfully",
        appointment: {
          ...appointment,
          slot: `${slot.startTime} - ${slot.endTime}`,
          doctor: slot.doctor.name,
        },
      });

    } catch (error) {
      if (error.code === "P2002") {
        return res.status(400).json({ message: "Slot is already booked" });
      }
      console.error("Book slot error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }

  } catch (error) {
    console.error("Book slot error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { setAvailability, getDoctorSlots, getAvailableSlotsForUser, bookSlot };
