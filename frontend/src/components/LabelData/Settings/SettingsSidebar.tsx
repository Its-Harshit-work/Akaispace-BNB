'use client'
import { FC } from 'react'
import { usePathname } from 'next/navigation';
import { MonitorCog, WalletMinimal } from 'lucide-react';
import Link from 'next/link';
import SideLink from '@/components/SideLink';

interface SettingsSidebarProps {

}

const SettingsSidebar: FC<SettingsSidebarProps> = ({ }) => {
    const pathname = usePathname();
    const urlArray = pathname.split('/');
    return (
        <div className='bg-[#D2D2D2] min-h-screen w-[15%] p-5'>
            <p className='font-semibold text-xl mt-4 mb-2'>Account</p>
            <Link href='/label-data/settings/profile' className={` text-base hover:text-bigRed ${urlArray.includes('profile') && 'text-red-800'}`}>Login and Security</Link>
            <p className='text-xl my-6 font-medium'>Workspaces</p>
            <p className='mt-4 text-base text-[#747474] '>User&apos; Workspace</p>
            <div className='pl-2 flex flex-col gap-6 mt-6'>
                <SideLink active={urlArray.includes('billing')} className='w-full' linkClassName=' gap-2' hrClassName='w-[85%]' icon={<WalletMinimal />} link={`/label-data/settings/billing`} title='Plan and Billing' key='Billing' />
                <SideLink active={urlArray.includes('usage')} className='w-full' linkClassName=' gap-2' hrClassName='w-[85%]' icon={<MonitorCog />} link={`/label-data/settings/usage`} title='Usage' key='Usage' />
            </div>

        </div>
    )
}

export default SettingsSidebar