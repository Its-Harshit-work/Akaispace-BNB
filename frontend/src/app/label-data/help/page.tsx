import Header from '@/components/LabelData/Header'
import { FC } from 'react'

interface pageProps {

}

export const metadata = {
    title: "Help - Akai Space",
    description: "Help page of Akai Space"
}

const page: FC<pageProps> = ({ }) => {
    return (
        <div className='flex-1 min-h-screen bg-darkBg'>
            <Header title='Help' />
        </div>
    )
}

export default page