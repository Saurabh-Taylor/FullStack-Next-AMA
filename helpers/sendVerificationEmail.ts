import VerificationEmail from "@/components/email-template";
import { resend } from "@/lib/resend";
import {  ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(username:string , email:string , verifyCode:string): Promise<ApiResponse> {
    try {
        
        const mailConfig = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message  | Verification Code',
            react: VerificationEmail({username , otp:verifyCode}),
          });
        //   console.log(mailConfig);
        // without domain error --> u can only send verification mail to ur own self account which is registered on resend email
        // { data: { id: 'a4ac9d35-f0c4-4473-a3f4-9c46851cf4a6' }, error: null }
          
          return { success: true, message: 'Verification email sent successfully.' };
    } catch (error) {
        console.error("Error While sending verification email:" , error)
        return {success:false , message:"Failed to send verification mail"}
    }
}