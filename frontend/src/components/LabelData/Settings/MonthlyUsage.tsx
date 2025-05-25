'use client'
import { FC } from 'react'
import IconBtn from '../../ui/IconBtn'
import { CircleArrowUp } from 'lucide-react'

interface MonthlyUsageProps {

}

const MonthlyUsage: FC<MonthlyUsageProps> = ({ }) => {
    return (
        <div className='flex items-center justify-between font-albert-sans bg-[#D2D2D2] px-6 py-4 w-[70%] rounded-lg'>
            <div>
                <div className='text-lg font-semibold'>
                    Monthly Usage
                </div>
                <div>
                    09 days Remaining | Resets on DD/MM/YY
                </div>
            </div>
            <IconBtn icon={<CircleArrowUp />} title='Increase Limit' />
        </div>
    )
}

export default MonthlyUsage