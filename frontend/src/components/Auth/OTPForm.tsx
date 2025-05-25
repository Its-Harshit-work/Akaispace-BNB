'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

interface OTPFormProps { }

const OTPForm: FC<OTPFormProps> = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email')
    const [otp, setOtp] = useState("");  // State to manage OTP input

    // Handle form submission
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission behavior
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/verify-otp`, {
            email: email,
            otp: otp
        });

        const status = res.status;
        if (status === 200) {
            toast.success('OTP verified successfully');
            router.push('/auth/login');
        }
    };

    const resendOTP = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/resend-otp`, {
                email: email
            });
            const data = await res.data;
            toast.success(data.message)
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Try Again")
        }
    }

    return (
        <div className='w-full flex flex-col items-center '>
            <div className=' gap-6 border border-black px-20 py-4
            bg-white shadow-[3px_3px_0px_0px_rgba(204,11,33,1)] font-albert-sans relative z-10'>
                <form onSubmit={onSubmit} className='    flex flex-col items-center gap-3'>
                    <label htmlFor="otp">Enter OTP:</label>
                    <InputOTP
                        className='my-4'
                        maxLength={6}
                        value={otp}
                        onChange={(value) => {
                            setOtp(value)

                        }}
                        required
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <button className='px-4 py-2 mt-3 active:scale-95 bg-gradient-to-t from-red-500 from-5%
                     to-red-700 to-90% hover:from-red-600 hover:to-red-800 text-white rounded-sm' type="submit">Submit OTP</button>
                    <button onClick={resendOTP} className='text-sm mt-2 text-slate-700 hover:underline' >Resend OTP</button>
                </form>
            </div>
        </div>
    );
};

export default OTPForm;