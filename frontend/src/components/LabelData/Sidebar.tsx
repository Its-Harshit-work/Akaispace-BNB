'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import Image from 'next/image';
import { Bell, CircleHelp, Loader2, LogOut, Settings, Store, Wallet } from 'lucide-react';
import SideLink from '../SideLink';
import axios from 'axios';
import { toast } from 'sonner';

interface SidebarProps { }

const Sidebar: FC<SidebarProps> = ({ }) => {
    const router = useRouter()
    const pathname = usePathname();
    const urlArray = pathname.split('/');
    const [isLoading, setIsLoading] = useState(false)

    const logout = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/logout`, {}, {
                withCredentials: true
            });
            if (res.status === 200) {
                router.replace('/auth/login')
                toast("Logged Out Successfully!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error Logging Out. Please try again later");
        }
        finally {
            setIsLoading(false);
        }
    }

    if (pathname.startsWith('/label-data/projects/')) {
        return (

            <div className='bg-white w-[4%] pb-10 min-h-screen flex flex-col justify-between items-center'>
                <div className='pt-10'>
                    <Link href='/' className=''>
                        <Image width={42} height={38} quality={100} src='/logoSmall.png' alt='Akai Logo' className='object-cover mx-auto' />
                    </Link>
                    <div className='mt-20 flex flex-col gap-7'>
                        <Link href='/label-data/projects' className='mx-auto hover:text-bigRed transition-all duration-200'>
                            <Wallet className={`${urlArray.includes('projects') && 'text-bigRed'}`} />
                        </Link>
                        <Link href='/label-data/marketplace' className='mx-auto hover:text-bigRed transition-all duration-200'>
                            <Store className={`${urlArray.includes('marketplace') && 'text-bigRed'}`} />
                        </Link>
                        <Link href='#' className='mx-auto hover:text-bigRed transition-all duration-200'>
                            <Bell />
                        </Link>
                        <Link href='/label-data/settings/usage' className='mx-auto hover:text-bigRed transition-all duration-200'>
                            <Settings className={`${urlArray.includes('settings') && 'text-bigRed'}`} />
                        </Link>
                        <Link href='/label-data/help' className='mx-auto hover:text-bigRed transition-all duration-200'>
                            <CircleHelp className={`${urlArray.includes('help') && 'text-bigRed'}`} />
                        </Link>
                    </div>
                </div>
                <button onClick={logout} disabled={isLoading} className='hover:text-bigRed disabled:text-red-900 mx-auto'>
                    {isLoading ?
                        <Loader2 className='animate-spin' />
                        :
                        <LogOut />
                    }
                </button>
            </div>
        )
    }
    else {
        return (
            <div className='bg-white w-[15%] pb-10  min-h-screen flex flex-col justify-between items-center'>
                <div className='pt-10'>
                    <Link href='/' className=''>
                        <Image
                            width={170}
                            height={50}
                            src='/logo.png'
                            alt='Akai Logo'
                            className='w-[170px] h-auto mx-auto'
                        />
                    </Link>
                    <div className='mt-20 flex flex-col gap-7'>
                        <SideLink className='mx-auto w-36' linkClassName='gap-4' hrClassName='mx-auto h-px' active={urlArray.includes('projects')} icon={<Wallet />} link='/label-data/projects' title='Projects' key='Projects' />
                        <SideLink className='mx-auto w-36' linkClassName='gap-4' hrClassName='mx-auto h-px' active={urlArray.includes('marketplace')} icon={<Store />} link='/label-data/marketplace' title='Marketplace' key='Marketplace' />
                        <SideLink className='mx-auto w-36' linkClassName='gap-4' hrClassName='mx-auto' icon={<Bell />} link='#' title='Notification' key='Notification' />
                        <SideLink className='mx-auto w-36' linkClassName='gap-4' hrClassName='mx-auto' active={urlArray.includes('settings')} icon={<Settings />} link='/label-data/settings/usage' title='Settings' key='Settings' />
                        <SideLink className='mx-auto w-36' linkClassName='gap-4' hrClassName='mx-auto' active={urlArray.includes('help')} icon={<CircleHelp />} link='/label-data/help' title='Help' key='Help' />
                    </div>
                </div>
                <button onClick={logout} disabled={isLoading} className=' px-7 py-3 rounded-3xl mx-auto font-albert-sans font-semibold flex items-center justify-start gap-2
                hover:bg-red-600 hover:text-white transition-all duration-300 disabled:text-red-900'>
                    {isLoading ?
                        <>
                            <Loader2 className='animate-spin' />
                            <p>Logging Out</p>
                        </>
                        :
                        <>
                            <LogOut />
                            <p>Log Out</p>
                        </>
                    }
                </button>
            </div>
        )
    }

}

export default Sidebar
