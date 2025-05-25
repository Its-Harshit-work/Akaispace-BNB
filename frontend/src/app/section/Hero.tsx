'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'

type userData = {
  hasFilledForm: boolean,
  role: string
}

const Hero = () => {
  const [userData, setUserData] = useState<userData>();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/get-user`,{}, {
          withCredentials: true,
        })
        setUserData(res.data.user)
      } catch (error) {
        console.error(error)
      }
    }
    getUserData();
  }, [])



  return (
    <main className='w-full lg:h-[90vh] -z-10 
    bg-[linear-gradient(to_right,_rgb(0,0,0,0.2)_1px,_transparent_1px)] bg-[size:20px_100%]'>
      <div className='w-full lg:flex lg:items-center lg:justify-evenly pt-5 px-6 pl-8 lg:pt-20 lg:px-20 lg:pr-32'>
        <div className='w-full lg:w-[60%]'>
          <p className='font-rexlia text-3xl lg:text-6xl'>AI Needs Reliable Data.</p>
          <p className='font-rexlia text-3xl lg:text-6xl'>We Deliver.</p>
          <p className='font-rexlia text-xl mt-6'>API-driven, high-quality labeled data for the future of AI innovation.</p>
          <div className='flex flex-col lg:flex-row lg:items-center gap-4 mt-10'>
            <button className="">
              <Image
                src='/btns/learn.png'
                alt="Learn More"
                width={192}
                height={48}
                className="lg:w-48 lg:h-12 w-36"
              />
            </button>
            <Link
              href={
                userData
                  ? userData?.hasFilledForm
                    ? '/label-data/projects'
                    : userData?.role === "user"
                      ? '/initial/individual'
                      : '/initial/company'
                  : '/auth/register'
              }
              className="active:scale-90"
            >
              <Image
                src='/btns/get.png'
                alt="Get Started"
                width={192}
                height={48}
                className="lg:w-48 lg:h-12 w-36"
              />
            </Link>
          </div>
        </div>
        <Image
          src="/hero.png"
          alt="Hero Illustration"
          width={800}
          height={600}
          className='lg:w-[40%] py-10 mx-auto'
        />
      </div>
    </main>
  )
}

export default Hero