'use client'
import { loginInputSchema } from '@/lib/validations/auth-input'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface LoginFormProps {

}

type FormData = z.infer<typeof loginInputSchema>;

const LoginForm: FC<LoginFormProps> = ({ }) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(loginInputSchema),
    });



    const onSubmit = async (data: FormData) => {
        try {
            const res = axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/login`, {
                email: data.email,
                password: data.password,
            }, {
                withCredentials: true,
            })

            if ((await res).status === 200) {
                router.push('/');
                toast.success('Successfully Logged in Akai Space')
            }

        } catch (error) {
            if (error instanceof z.ZodError) {
                setError("email", { message: error.message });
                setError("password", { message: error.message });
                return;
            }
            else if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
                console.log(error);

            }
            else {
                toast.error("Something went wrong. Please try again later.");
                console.log(error);
            }
        }
        finally {
            reset();
        }
    }
    return (
        <div className='flex flex-col gap-6 items-center font-albert-sans justify-center p-6 w-[30%] border border-black
     bg-white shadow-[3px_3px_0px_0px_rgba(204,11,33,1)] relative z-10'>
            <p className='text-prime font-semibold text-3xl' >Log In</p>
            <form action="" className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <label className=' ' htmlFor="email">Email</label>
                <input {...register("email")} type="text" className=' px-4 py-2 w-full bg-inputBg border
                 border-black focus:border-transparent focus:ring-1 focus:ring-inset focus:ring-prime rounded-sm' placeholder='Enter Email' />
                <p className="text-sm text-red-700">{errors.email?.message}</p>
                <div className='w-full flex flex-col mt-2'>
                    <label className=' ' htmlFor="password">Password</label>
                    <input {...register("password")} type="password" className='px-4 py-2 mb-2 w-full bg-inputBg border border-black focus:border-transparent
                     focus:ring-1 focus:ring-inset focus:ring-prime rounded-sm' placeholder='Enter Password' />
                    <p className=" text-sm text-red-700">{errors.password?.message}</p>
                    <Link href='#' className='text-blue-500 hover:underline self-end   mb-2 hover:opacity-85'>
                        <span className=''>Forgot Password?</span>
                    </Link>
                </div>
                <button disabled={isSubmitting} type='submit' className='px-4 w-full py-2 mt-3 active:scale-95 bg-gradient-to-t from-red-500 from-5%
                     to-red-700 to-90% hover:from-red-600 hover:to-red-800 text-white rounded-sm disabled:bg-slate-600' >{isSubmitting ? 'Logging in...' : 'Login'}</button>
            </form>
            <div className='flex items-center gap-2  '>
                <p>Don't have an account?</p>
                <Link href='/auth/register' className='text-blue-500 hover:underline hover:opacity-85'>
                    <span>Register</span>
                </Link>
            </div>
        </div>
    )
}

export default LoginForm