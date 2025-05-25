'use client'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const Footer = () => {
    const pathname = usePathname();
    return (
        <div className={`border-t-[3rem] border-t-prime w-full ${pathname.startsWith('/auth') && 'hidden'}`}>
            <div className='lg:flex justify-around lg:px-4 mt-16 relative'>
                <Image
                    src="/footer-dot.png"
                    alt=""
                    width={200} // Adjust these dimensions as necessary
                    height={200}
                    className='lg:w-[15%] hidden lg:block lg:h-[10%]'
                />
                <Image
                    src="/res-footer-dot.png"
                    alt=""
                    width={150}
                    height={150}
                    className='lg:hidden ml-20 absolute -left-12 -top-16'
                />
                <div className='pt-5 w-full lg:w-[65%]'>
                    <p className='pl-28 lg:pl-0 lg:px-0 font-rexlia w-full lg:w-auto text-4xl lg:text-5xl'>
                        MOVE TO THE ULTIMATE SPACE
                    </p>
                    <hr className='bg-black h-[2px] lg:ml-36 mt-12 lg:mt-2 ml-auto w-[70%] lg:w-[70%]' />
                    <Image
                        src="/footer-x.png"
                        alt=""
                        width={100}
                        height={100}
                        className='lg:w-20 w-24 mt-5 right-10 lg:right-20 absolute lg:static lg:ml-[47rem]'
                    />
                </div>
            </div>
            <div className='flex items-center mt-20 lg:mt-14 px-4 gap-8 lg:gap-14 lg:ml-32'>
                <Link href='https://x.com/akaispacexyz?s=21' >
                    <Image
                        src="/socials/X.svg"
                        alt="X logo"
                        width={40}
                        height={40}
                        className=''
                    />
                </Link>
                <Link href='https://t.me/+T-qxUuUGcBQxYWQ1'>
                    <Image
                        src="/socials/Telegram.svg"
                        alt="Telegram logo"
                        width={40}
                        height={40}
                        className='w-12'
                    />
                </Link>
                <Link href='https://discord.gg/R5sFJ32d'>
                    <Image
                        src="/socials/Discord.svg"
                        alt="Discord logo"
                        width={40}
                        height={40}
                        className='w-14'
                    />
                </Link>
            </div>
            <div className='flex flex-col lg:flex-row items-center justify-center py-4 lg:py-2 gap-6 bg-gray-300 lg:gap-10 mt-20'>
                <div className='font-helvetica-medium text-xl lg:text-base hover:underline '>About Us</div>
                <div className='font-helvetica-medium text-xl lg:text-base hover:underline '>Contact</div>
                <div className='font-helvetica-medium text-xl lg:text-base hover:underline '>Privacy Policy</div>
            </div>
            <p className='text-center font-helvetica-medium lg:py-1 py-3 text-base lg:text-base'>
                &copy; 2024 Akai Space. All Rights Reserved
            </p>
        </div>
    )
}

export default Footer;
