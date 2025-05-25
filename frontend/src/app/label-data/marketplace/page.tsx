import Header from '@/components/LabelData/Header'
import Marketplace from '@/components/LabelData/Marketplace/Marketplace';
import { cookies } from 'next/headers';
import { FC } from 'react'

interface pageProps {

}

export const metadata = {
    title: "Marketplace - Akai Space",
    description: "Marketplace page of Akai Space"
}

const page: FC<pageProps> = async ({ }) => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const getDatasetAPI = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/dataset/get-all`, {
        method: "GET",
        headers: {
            Cookie: `refreshToken=${refreshToken || ""};accessToken=${accessToken || ""
                }`,
        }
    })
    const getDataset = await getDatasetAPI.json()
    return (
        <div className='flex-1 min-h-screen bg-darkBg'>
            <Header title='Marketplace' />
            <Marketplace datasets={getDataset} />
        </div>
    )
}

export default page