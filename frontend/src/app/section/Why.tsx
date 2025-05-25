import React from 'react';
import Image from 'next/image';

const Why = () => {
    return (
        <div className='w-full -z-10 pb-0
         bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(0,0,0,0.2)_1px,_transparent_1px)] bg-[size:20px_20px]'>
            <div className='w-full'>
                <Image
                    src='/borders/why-top.png'
                    alt="Top border"
                    width={1920}
                    height={80}
                    className='w-full h-20'
                />
                <div className='w-full py-14'>
                    <div className='md:flex md:items-center md:gap-10 md:justify-center w-full md:mb-40 mb-20'>
                        <div className="relative hidden md:block">
                            <div className="absolute bottom-[-10px] left-0 right-0 mx-auto w-32 h-8 bg-black/35 rounded-full blur-md"></div>
                            <Image
                                src="/alien.png"
                                alt="Alien illustration"
                                width={176}
                                height={176}
                                className='w-44 h-44 relative animate-bounce'
                            />
                        </div>
                        <div className='border border-black mt-6 w-[80%] lg:mx-0 lg:w-[40%] px-4 py-2 mx-auto md:p-6 bg-white'>
                            <p className='font-rexlia text-4xl mb-6'>Why Akai Space?</p>
                            <p className='font-rexlia text-xl'>Highlight our mission to empower AI with reliable data.</p>
                        </div>
                    </div>
                    <div className='lg:flex lg:items-center lg:gap-20 lg:justify-center w-full lg:mb-32'>
                        <div className='flex lg:w-2/6 w-[90%] mx-auto lg:mx-0 items-center gap-4 border border-black p-2 bg-white'>
                            {/* <div className='size-20 bg-black'></div> */}
                            <div className='flex-1 px-6'>
                                <p className='font-rexlia text-xl mb-3'>Blockchain Transparency & Gamified Labeling</p>
                                <p className='font-rexlia text-base'>Compare traditional data labeling vs. Akai Space&apos;s platform.</p>
                            </div>
                        </div>
                        <div className='flex lg:w-2/6 w-[90%] mx-auto lg:mx-0 items-center gap-4 mt-10 lg:mt-0 border border-black p-2 bg-white'>
                            {/* <div className='size-20 bg-black'></div> */}
                            <div className='flex-1 px-6'>
                                <p className='font-rexlia text-xl'>Infographic Showcase</p>
                                <p className='font-rexlia text-base my-4'>See how we revolutionize AI data labeling.</p>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-red-600 text-white px-4 py-1 rounded-md text-sm font-helvetica-medium'>Blockchain</div>
                                    <div className='bg-red-600 text-white px-4 py-1 rounded-md text-sm font-helvetica-medium'>Gamified</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Image
                    src="/borders/comp-top-1.png"
                    alt="Bottom border"
                    width={1920}
                    height={80}
                    className='w-full h-20'
                />
            </div>
        </div>
    );
};

export default Why;
