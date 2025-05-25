'use client'
import { CircleUserRound, LogOut, Mail, Trash2 } from 'lucide-react'
import { FC, useState } from 'react'
import IconBtn from '../../ui/IconBtn'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

interface ProfileProps {
    userData: User
}

const Profile: FC<ProfileProps> = ({ userData }) => {
    const router = useRouter();
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


    return (
        <div className='w-full p-7'>
            <div className='bg-white p-4 rounded-lg flex items-center justify-between'>
                <div className="flex gap-4">
                    <CircleUserRound className='text-gray-500 size-12 self-center' />
                    <div>
                        <p className='font-bold text-xl'>
                            {userData.username}
                        </p>
                        <p className='text-gray-500 -mt-2'>
                            {userData.email}
                        </p>
                    </div>
                </div>
                {/* <button className={`bg-gray-300 flex items-center gap-2 px-4 py-2 rounded-lg `}>
                    <LogOut />
                    <div className='h-6 w-[1px] bg-gray-800 opacity-40 border-0' />
                    <span>Sign Out</span>
                </button> */}
                <IconBtn disabled={isLoading} onClick={logout} icon={<LogOut />} title='Sign Out' />
            </div>
            <div className='flex items-center gap-5 mt-10'>
                <button className={`bg-white flex items-center gap-2 px-4 py-2 rounded-lg `}>
                    <Mail />
                    <div className='h-6 w-[1px] bg-gray-600 opacity-40 border-0' />
                    <span>Change Email</span>
                </button>
                <button className={`bg-[#242424] border-2 border-white text-white flex items-center gap-2 px-4 py-2 rounded-lg `}>
                    <Trash2 />
                    <div className='h-6 w-[1px] bg-gray-300 opacity-40 border-0' />
                    <span>Delete Account</span>
                </button>
            </div>
        </div>
    )
}

export default Profile