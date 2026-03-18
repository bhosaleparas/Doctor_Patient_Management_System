import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";



const registerUser = async (req, res) => {
    const {name,email,password,phone,dob,gender,city,address,pincode}=req.body;
    // console.log(name)
    // console.log(password)
    const checkUser=await prisma.User.findUnique({where: { email }});
    // console.log(email)

    if(checkUser) {
        return res.status(400).json({message:"Email already exists"});
    }

    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt);
    console.log(hashPassword);

    const user=await prisma.User.create({
        data:{
            name,
            email,
            password:hashPassword,
            phone,
            dob:new Date(dob),
            gender,
            city,
            address,
            pincode:parseInt(pincode)
        },
    });

    res.status(201).json({
        data:{
            user:{
                id:user.id,
                name:user.name,
                email:user.email
            }
        }
    })
};


const loginUser = async (req, res) => {
  
};

export { registerUser,loginUser };
