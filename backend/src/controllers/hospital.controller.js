import { prisma } from '../config/db.js';
import slugify from 'slugify';



const createHospital = async (req, res) => {
  try {
    const { name, address, city, phone, email, pincode } = req.body;

    if (!name || !address || !city || !phone || !email || !pincode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    
    const slug = slugify(name, { lower: true, strict: true });

    const existing = await prisma.hospital.findFirst({
      where: { OR: [{ slug }, { email }] }
    });

    if (existing) {
      return res.status(409).json({
        message: existing.email === email ? 'Email already registered' : 'Hospital with this name already exists'
      });
    }

    const hospital = await prisma.hospital.create({
      data: { name, slug, address, city, phone, email, pincode }
    });

    res.status(201).json({
      message: 'Hospital created successfully',
      hospital
    });

  } catch (error) {
    console.error('Create hospital error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        city: true,
        phone: true,
        email: true,
        pincode: true,
        createdAt: true,
        _count: {
          select: {
            doctors: true,   
            admins: true     
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      total: hospitals.length,
      hospitals
    });

  } catch (error) {
    console.error('Get all hospitals error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getHospitalsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const hospitals = await prisma.hospital.findMany({
      where: { city: { contains: city, mode: 'insensitive' } },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        city: true,
        phone: true,
        email: true,
        _count: {
          select: { doctors: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    if (hospitals.length === 0) {
      return res.status(404).json({ message: `No hospitals found in ${city}` });
    }

    res.status(200).json({
      city,
      total: hospitals.length,
      hospitals
    });


  } catch (error) {
    console.error('Get hospitals by city error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// search hospital by city or other query
const searchHospitals = async (req, res) => {
  try {
    const { q, city } = req.query;

    const hospitals = await prisma.hospital.findMany({
      where: {
        AND: [
          q    ? { name: { contains: q,    mode: 'insensitive' } } : {},
          city ? { city: { contains: city, mode: 'insensitive' } } : {},
        ]
      },
      select: {
        id     : true, name   : true,
        slug   : true, address: true,
        city   : true, phone  : true,
        email  : true, pincode: true,
        _count : { select: { doctors: true } }
      },
      orderBy: { name: 'asc' }
    });

    res.status(200).json({ total: hospitals.length, hospitals });
  } catch (error) {
    console.error('Search hospitals error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



//get hospital from slug(name string)
const getHospitalBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const hospital = await prisma.hospital.findUnique({
      where  : { slug },
      include: {
        _count: { select: { doctors: true, admins: true } }
      }
    });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    res.status(200).json({ hospital });
  } catch (error) {
    console.error('Get hospital error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// get doctors of hospitals
const getHospitalDoctors = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, specialization, gender, minFee, maxFee, date } = req.query;
    
    const hospital = await prisma.hospital.findUnique({ where: { slug } });
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const where = { hospitalId: hospital.id, status: true };

    if (name) {
      where.OR = [
        { name          : { contains: name, mode: 'insensitive' } },
        { specialization: { contains: name, mode: 'insensitive' } },
      ];
    }
    if (specialization) where.specialization = { contains: specialization, mode: 'insensitive' };
    if (gender)         where.gender = gender;
    if (minFee || maxFee) {
      where.fee = {};
      if (minFee) where.fee.gte = parseFloat(minFee);
      if (maxFee) where.fee.lte = parseFloat(maxFee);
    }

    let doctors = await prisma.doctor.findMany({
      where,
      select: {
        id            : true,
        name          : true,
        specialization: true,
        cabin         : true,
        fee           : true,
        gender        : true,
        status        : true,
        hospital      : { select: { name: true, city: true } },
        ...(date ? {
          slots: {
            where : { date: new Date(date), isBooked: false, isBlocked: false },
            select: { id: true, startTime: true, endTime: true }
          }
        } : {})
      },
      orderBy: { name: 'asc' }
    });

    if (date) {
      doctors = doctors.filter(d => d.slots && d.slots.length > 0);
    }

    res.status(200).json({
      hospital: { id: hospital.id, name: hospital.name, slug: hospital.slug },
      total   : doctors.length,
      doctors,
    });
  } catch (error) {
    console.error('Get hospital doctors error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export {createHospital,getAllHospitals,getHospitalsByCity, getHospitalBySlug, getHospitalDoctors, searchHospitals};