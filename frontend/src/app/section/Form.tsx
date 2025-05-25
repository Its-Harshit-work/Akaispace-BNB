'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { emailerInputSchema } from '@/lib/validations/emailer-input';
import { z } from 'zod';



type FormData = z.infer<typeof emailerInputSchema>;

const Form = () => {

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(emailerInputSchema),
  });


  const onSubmit = async (data: FormData) => {
    try {
      const res = axios.post('https://newsletter-api-cflj.onrender.com/api/users/add', {
        username: data.name,
        email: data.email,
      })

      toast.promise(res, {
        loading: 'Submitting...',
        success: 'Successfully joined the newsletter!',
        error: 'Failed to join the newsletter. Please try again.',
      })

    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        setError("name", { message: error.message });
        return;
      }
      console.log(error);
      toast.error('An unexpected error occurred.')
    }
    finally {
      reset();
    }
  }

  return (
    <div className='w-full h-[44rem] relative border-b-[12px] border-gray-400'>
      <Image
        src='/form-triangle.png'
        alt=''
        width={500}
        height={500}
        className='absolute inset-0 size-20 top-0'
      />
      <Image
        src='/bg/form-bg.png'
        alt=''
        width={1920}
        height={700}
        className='absolute -z-10 w-full hidden lg:block h-[28rem] bottom-0'
      />
      <Image
        src='/bg/res-form-bg.png'
        alt=''
        width={750}
        height={700}
        className='w-full lg:hidden absolute -z-10'
      />
      <p className='font-rexlia pl-10 pt-20 text-5xl lg:pl-32 lg:pt-32'>
        Join the AI Revolution Today
      </p>
      <p className='font-helvetica-medium pl-10 text-lg lg:pl-32 mt-4 text-gray-700'>
        Subscribe now to get the latest AI trends and updates straight to your inbox.
      </p>
      <form className='' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col lg:flex-row justify-center gap-10 px-10 lg:px-0 lg:gap-20 mt-10 lg:mt-[12rem]'>
          <div className='flex-col flex gap-1 '>
            <label htmlFor='name' className='font-helvetica-medium'>
              Name
            </label>
            <input
              {...register("name")}
              className='px-3 py-1 bg-white border border-black lg:w-[32rem] font-helvetica-medium'
              type='text'
              placeholder='Enter your name'
            />
            <p className="mt-1 text-sm text-red-700">{errors.name?.message}</p>
          </div>
          <div className='flex-col flex gap-1'>
            <label htmlFor='email' className='font-helvetica-medium'>
              Email
            </label>
            <input
              {...register("email")}
              className='px-3 bg-white py-1 border border-black lg:w-[32rem] font-helvetica-medium'
              type='email'
              placeholder='Enter your email'
            />
            <p className='text-xs font-helvetica-medium text-gray-400 mt-1'>
              We respect your privacy
            </p>
            <p className="mt-1 text-sm text-red-700">{errors.email?.message}</p>
          </div>
        </div>
        <div className='flex justify-center mt-8'>
          <button className='' type='submit'>
            <Image
              src='/btns/submit.png'
              alt='Submit-form'
              width={128}
              height={56}
              className='w-32 h-14'
            />
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form
