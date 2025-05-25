import TestimonialBox from '../../components/LandingPage/TestimonialBox'
import React from 'react'
import Image from 'next/image'

const Testimonials = () => {
    return (
        <section className='w-full -z-10 mt-24 relative
        bg-[linear-gradient(to_bottom,_rgb(0,0,0,0.2)_1px,_transparent_1px)] bg-[size:100%_32px]'>
            <div className='w-full'>
                <Image
                    src="/borders/testimonial-top.png"
                    alt="border-top"
                    width={1920}
                    height={80}
                    className='w-full h-20 absolute -top-10'
                />
                <div className='w-full flex justify-between'>
                    <Image
                        src="/borders/testimonial-left.png"
                        alt="border-left"
                        width={40}
                        height={600}
                        className='w-10 lg:w-auto'
                    />
                    <div className='flex-1 ml-4 lg:ml-0 lg:flex lg:items-center w-full lg:justify-between lg:px-10 py-32'>
                        <div>
                            <p className='font-rexlia text-5xl lg:text-4xl mb-6'>Trusted By <br />Innovators</p>
                            <p className='font-rexlia text-xl my-10 lg:my-0 text-prime lg:mb-6'>Real testimonials from beta users and companies.</p>
                        </div>
                        <div className='flex lg:flex-row flex-col lg:items-center gap-10 lg:mr-6'>
                            <TestimonialBox name="John Doe" rating={4} testimonial="Akai Space has transformed the way we label data for our AI models." />
                            <TestimonialBox name="Jane Doe" rating={5} testimonial="The gamification features really keep us engaged while contributing to AI projects." />
                        </div>
                    </div>
                    <Image
                        src="/borders/testimonial-right.png"
                        alt="border-right"
                        width={40}
                        height={600}
                        className='w-10 lg:w-auto'
                    />
                </div>
            </div>
        </section>
    )
}

export default Testimonials
