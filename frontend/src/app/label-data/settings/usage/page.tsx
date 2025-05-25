import Header from '@/components/LabelData/Header'
import MonthlyUsage from '@/components/LabelData/Settings/MonthlyUsage'
import UsageDetails from '@/components/LabelData/Settings/UsageDetails'

import { FC } from 'react'

interface pageProps {

}

const page: FC<pageProps> = ({ }) => {
    return (
        <div className='w-full min-h-screen'>
            <Header title='Usage Settings' />
            <div className='px-8 mt-8'>
                <MonthlyUsage />
                <UsageDetails />
            </div>

        </div>
    )
}

export default page