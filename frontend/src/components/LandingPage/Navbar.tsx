'use client'
import React, { useEffect, useState } from 'react';
import { Search, Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import axios from 'axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/get-user`, {}, {
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
    <div className={`relative ${pathname === '/' ? 'block' : 'hidden'}`}>
      {/* Main Navbar */}
      <div className="flex items-center lg:justify-between justify-start gap-6  px-6 lg:gap-16 w-full lg:h-20 h-16 shadow-md bg-white">
        {/* Left: Menu Button for Small Screens */}
        <button
          className="lg:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu size={28} className="text-black" />
        </button>

        <Image src="/logo.png" alt="Logo" width={263} height={50} />

        {/* Center and Right: Links and Search */}
        <div className="hidden lg:flex items-center gap-28">
          <div className={clsx('flex gap-10 items-center', !userData && 'mr-24')}>
            <Link href='/' className={clsx('font-helvetica-medium text-lg px-8 py-2',
              pathname === "/" ? 'bg-[#CC0B21] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)]' : 'underline')}>
              Home
            </Link>
            <Link href='/label-data/projects' className={clsx('font-helvetica-medium text-lg border-[4px] px-3 py-2 border-transparent hover:border-bigRed transition-all duration-300', pathname.startsWith("/label-data") && 'underline')}>
              Label Data
            </Link>
          </div>
          {
            userData &&
            <Link href='/label-data/settings/profile' className='rounded-full p-2 text-bigRed border border-slate-700 hover:shadow-md hover:cursor-pointer'>
              <User />
            </Link>
          }
        </div>
      </div>

      {/* Responsive Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-[70%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-end p-4">
          <button
            className="text-black focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={28} />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col items-start justify-between h-[90vh]">
          <div className='flex flex-col gap-6 px-6'>
            <div className="relative">
              <input
                type="text"
                placeholder="Search in site"
                className="w-full px-3 py-2 pr-10 bg-white border border-black rounded-md shadow-[4px_4px_0px_0px_rgba(207,11,3,1)]"
              />
              <Search
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600"
              />
            </div>
            <Link
              href="/"
              className={clsx('text-lg font-helvetica-medium px-8 py-2',
                pathname === "/" ? 'bg-[#CC0B21] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] w-fit' : 'underline')}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/label-data/projects"
              className={clsx('text-lg font-helvetica-medium', pathname.startsWith("/label-data") && 'underline')}
              onClick={() => setIsMenuOpen(false)}
            >
              Label Data
            </Link>
          </div>
          {
            userData &&
            <Link href='/label-data/settings/profile' className='ml-6 group group-hover:shadow-md flex items-start gap-3 group-hover:cursor-pointer'>
              <User className='rounded-full text-bigRed group-hover:cursor-pointer group-hover:shadow-md' />
              <h2 className='text-xl font-semibold group-hover:cursor-pointer group-hover:shadow-md'>{userData.username}</h2>
            </Link>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;