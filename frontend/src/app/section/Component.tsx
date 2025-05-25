import Image from 'next/image'
import React from 'react'

const Component = () => {
    return (
        <div className='w-full relative' >
            <div className='w-full h-20 relative'>
            <Image src="/borders/comp-top-2.png" quality={100} layout='fill' className='' alt="border-image-1" />
            </div>
            <Image width={1440} height={768} src="/bg/comp-bg.png" className='w-full hidden lg:block min-h-screen -z-10 absolute top-0 ' alt="" />
            <Image width={393} height={1938} src="/bg/res-comp-bg.png" alt="" className='w-full lg:hidden -z-10 absolute  top-0' />
            <div className='w-full flex flex-col justify-center items-center px-6 lg:px-0'>
                <div>
                    <p className='font-rexlia text-4xl mb-6'>Core Components of Akai Space</p>
                    <p className='font-rexlia text-xl mb-6'>Explore our customer platform, labeler platform, AI Engine, and gamification features.</p>
                    <button className="">
                        <Image width={500} height={500} src='/btns/explore.png' alt="Get Started" className="w-48 h-12" />
                    </button>
                </div>
                <div className='w-full  lg:flex lg:items-center my-10 lg:justify-center lg:gap-10'>
                    <div className='lg:w-[20%]  mb-10 lg:mb-0' >
                        <div className='bg-white mx-auto size-72 border-[2.5px] border-slate-400 flex items-center justify-center '>
                            <p className='font-rexlia text-xl '>Customer Platform SS</p>
                        </div>
                        <div className='w-full mt-3 lg:mt-0'>
                            <p className='font-rexlia text-base text-center ' >APIs & Real-time Dashboards</p>
                            <p className='font-rexlia text-xl text-center' >Data management tools, telemetry dashboards</p>
                        </div>
                    </div>
                    <div className='lg:w-[20%] mb-10 lg:mb-0' >
                        <div className='bg-white mx-auto size-72 border-[2.5px] border-slate-400 flex items-center justify-center'>
                            <p className='font-rexlia text-xl '>Labeler Platform SS</p>
                        </div>
                        <div className='w-full mt-3 lg:mt-0'>
                            <p className='font-rexlia text-base text-center' >Incentivized Tasks & Training</p>
                            <p className='font-rexlia text-xl text-center' >Annotation apps, performance analytics</p>
                        </div>
                    </div>
                    <div className='lg:w-[20%] mb-10 lg:mb-0' >
                        <div className='bg-white mx-auto size-72 border-[2.5px] border-slate-400 flex items-center justify-center'>
                            <p className='font-rexlia text-xl '>Coming Soon</p>
                        </div>
                        <hr  className='h-2 w-[18rem] bg-red-600 mx-auto' />
                        <div className='w-full mt-3 lg:mt-0'>
                            <p className='font-rexlia text-base text-center' >Validation & Automated Models</p>
                            <p className='font-rexlia text-xl text-center' >Error detection, hybrid labeling</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Component