import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponse";





export  async function POST(request:NextRequest , response:NextResponse){
    await dbConnect()
    try {

        const {username , email , password} = await request.json()

        // To check whether user exists and is verified 
        // By username
        const existingVerifiedUserByUsername = await UserModal.findOne({username , isVerified:true})
        if(existingVerifiedUserByUsername){
            return Response.json({
                success:false,
                message:"User already exists"
            })
        }

        // To check whether the user exists by email and is verified or not
        const existingUserByEmail = await UserModal.findOne({email})
         
        // VERIFICATION CODE 
        const verifyCode = Math.floor(100000 +Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
              return Response.json(
                {
                  success: false,
                  message: 'User already exists with this email',
                },
                { status: 400 }
              );
            } else {
              const hashedPassword = await bcrypt.hash(password, 10);
              existingUserByEmail.password = hashedPassword;
              existingUserByEmail.verifyCode = verifyCode;
              existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
              await existingUserByEmail.save();
            }
        }else{
            // If user doesnt exists , save it in DB
            let hashedPassword = await bcrypt.hash(password , 10)
            const expiryDate  = new Date()
            
            //! expiry date is object , so it doesnt matter whether we are using let , const , var  , memory ke andar reference point h 
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModal({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                message: []
            })

            await newUser.save()
        }
        //send verification email
        await sendVerificationEmail(username , email ,verifyCode )

    } catch (error) {
        console.error("Error Registering Users", error)
        return Response.json({
            success:false,
            message:"Error Registering User"
        } , {status:500})
    }

    
}