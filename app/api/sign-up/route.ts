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
    } catch (error) {
        console.error("Error Registering Users", error)
        return Response.json({
            success:false,
            message:"Error Registering User"
        } , {status:500})
    }

    
}