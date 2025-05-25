'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import CustomBtn from '../ui/CustomBtn'
import { useForm } from 'react-hook-form'
import { registerInputSchema } from '@/lib/validations/auth-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface RegisterFormProps {
    role: string
}

type FormData = z.infer<typeof registerInputSchema>;

const RegisterForm: FC<RegisterFormProps> = ({ role }) => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(registerInputSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/register`, {
                username: data.name,
                email: data.email,
                password: data.password,
                role: role,
            })
            const status = (await res).status
            toast.promise(res, {
                loading: 'Submitting...',
                success: 'Registered Successfully at Akai Space',
                error: 'Failed to Register. Please try again.',
            })
            if (status === 201) {
                router.push(`/auth/otp?email=${data.email}`)
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError("email", { message: error.message });
                setError("name", { message: error.message });
                setError("password", { message: error.message });
                return;
            }
            if (error instanceof AxiosError) {
                const backendErrorMessage = error.response?.data?.message || 'An unexpected error occurred.';

                // Display the backend error message in the toast
                toast.error(backendErrorMessage);
            }
            console.log(error);
        }
        finally {
            reset();
        }
    }
    return (
        <div className='w-full flex flex-col items-center'>
            <div className=' gap-6  px-6 py-4 border border-black w-[30%]
bg-white shadow-[3px_3px_0px_0px_rgba(204,11,33,1)] font-albert-sans relative z-10'>
                <p className='text-prime  font-semibold text-3xl my-4 text-center' >Register</p>
                <form action="" onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center' >
                    <div className='flex-col flex gap-1 '>
                        <label htmlFor='name' className=' '>
                            Username
                        </label>
                        <input
                            {...register("name")}
                            className='px-3 py-1 bg-white border border-black focus:border-transparent
                     focus:ring-1 focus:ring-inset focus:ring-prime w-full mx-auto rounded-sm  '
                            type='text'
                            placeholder='Enter your Username'
                        />
                        <p className="mt-1 text-sm text-red-700">{errors.name?.message}</p>
                    </div>
                    <div className='flex-col flex gap-1'>
                        <label htmlFor='email' className=' '>
                            Email
                        </label>
                        <input
                            {...register("email")}
                            className='px-3 bg-white py-1 border border-black focus:border-transparent
                     focus:ring-1 focus:ring-inset focus:ring-prime w-full mx-auto rounded-sm '
                            type='email'
                            placeholder='Enter your email'
                        />
                        <p className="mt-1 text-sm text-red-700">{errors.email?.message}</p>
                    </div>
                    <div className='flex-col flex gap-1'>
                        <label htmlFor='password' className=' '>
                            Password
                        </label>
                        <input
                            {...register("password")}
                            className='px-3 bg-white py-1 border border-black w-full focus:border-transparent
                     focus:ring-1 focus:ring-inset focus:ring-prime mx-auto rounded-sm '
                            type='password'
                            placeholder='Enter your Password'
                        />
                        <p className="mt-1 text-sm text-red-700">{errors.password?.message}</p>
                    </div>
                    <button type='submit' className='px-4 py-2 mt-3 active:scale-95 bg-gradient-to-t from-red-500 from-5%
                     to-red-700 to-90% hover:from-red-600 hover:to-red-800 text-white rounded-sm ' >Register</button>
                </form>
                <div className='flex items-center justify-center gap-2 mt-2  '>
                    <p>Already Signed Up?</p>
                    <Link href='/auth/login' className='text-blue-500 hover:underline hover:opacity-85'>
                        <span>Login</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm