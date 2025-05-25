import GetInTouchIndividual from '@/components/GetInTouchIndividual'
import { FC } from 'react'

interface pageProps {

}

const page: FC<pageProps> = ({ }) => {
    return (
        <main className='w-full font-albert-sans min-h-screen px-14 py-5'>
            <p className='text-3xl font-bold text-bigRed '>Let&apos; Fuel Your AI</p>
            <p className='text-lg text-gray-600 font-semibold'>Book a 1:1 demo with us to get started</p>
            <GetInTouchIndividual />
        </main>
    )
}

export default page