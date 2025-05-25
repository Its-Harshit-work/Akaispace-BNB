
import Sidebar from '@/components/LabelData/Sidebar'
import { FC, ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';


interface layoutProps {
    children: ReactNode
}

const layout: FC<layoutProps> = async ({ children }) => {
    const cookieStore = await cookies(); // Get cookies from the request
    const accessToken = cookieStore.get('accessToken');
    const refreshToken = cookieStore.get('refreshToken');
    return (
        <main className='w-full min-h-screen font-albert-sans flex '>
            <Sidebar />
            <main className='flex-1 min-h-screen'>
                {children}
            </main>
        </main>
    )
}

export default layout