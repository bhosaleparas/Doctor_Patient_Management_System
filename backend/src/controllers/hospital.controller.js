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


export {createHospital,getAllHospitals,getHospitalsByCity};