import { Bell, Mail } from 'lucide-react'
import { FC } from 'react'

interface HeaderProps {
    title: string
}

const Header: FC<HeaderProps> = ({ title }) => {
    return (
        <div className='w-full px-7 py-4 font-albert-sans flex  justify-between'>
            <div className='w-[60%] self-end '>
                <p className='text-white font-normal ml-10 text-4xl'>{title}</p>
                <hr className='bg-white border-0 mt-4 h-px w-full' />
            </div>
            <div className='flex self-center items-center justify-around w-[30%] mx-auto'>
                <input type="text" className='bg-[#2C2C2C] px-4 py-1 rounded-md w-64 text-white focus:border-none focus:ring-2 focus:ring-bigRed' placeholder='Search' />
                <div className='flex items-center gap-3 ml-5'>
                    <Mail className='text-lightGray' />
                    <div className='relative'>
                        <Bell className='text-lightGray' />
                        <span className='size-2 top-0 right-0 absolute bg-bigRed rounded-full' />
                    </div>
                    <div className='bg-white ml-5 rounded-full size-7' />
                </div>
            </div>
        </div>
    )
}

export default Header