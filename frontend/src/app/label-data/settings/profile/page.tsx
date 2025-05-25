import Header from '@/components/LabelData/Header'
import Profile from '@/components/LabelData/Settings/Profile'
import { getUserData } from '@/lib/utils';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { FC } from 'react'

interface pageProps {
}

export const metadata: Metadata = {
    title: "Profile - Akai Space"
}



const page: FC<pageProps> = async ({ }) => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const userData = await getUserData(refreshToken, accessToken);
    

    return (
        <div className='w-full min-h-screen'>
            <Header title='Your Profile' />
            <div className='px-8 mt-8'>
                <Profile userData={userData.user} />
            </div>

        </div>
    )
}

export default page