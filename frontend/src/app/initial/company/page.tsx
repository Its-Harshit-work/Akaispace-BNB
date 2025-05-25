import GetInTouchCompany from '@/components/GetInTouchCompany';
import { FC } from 'react'

interface pageProps {

}

export const metadata = {
    title: 'Contact with Akai Space Team',
    description: 'Get In Touch Page of Akai Space',
};

const page: FC<pageProps> = ({ }) => {
    return (
        <main className='w-full font-albert-sans min-h-screen px-14 py-5'>
            <p className='text-3xl font-bold text-bigRed '>Let&apos; Scale Together</p>
            <p className='text-lg text-gray-600 font-semibold'>Book a 1:1 demo with us to get started</p>
            <GetInTouchCompany />
        </main>
    )
}

export default page