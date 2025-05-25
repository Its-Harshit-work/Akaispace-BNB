"use client";

import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import Image from 'next/image';
import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className='relative w-full h-screen flex flex-col gap-4 items-center justify-center bg-darkBg overflow-hidden'>
            <AnimatedGridPattern
                width={50}
                height={50}
                className="fill-gray-500/30 stroke-gray-500/30"
                maxOpacity={0.3}
                duration={3}
            />
            <Image src='/white-logo.png' alt="Logo" width={450} height={100} className='pl-4 relative z-10' />
            {children}
        </div>
    );
};

export default AuthLayout; 