'use client'
import { FC } from 'react'
import Header from './LabelData/Header'
import { Switch } from './ui/switch'

interface PricingPageProps {

}

const PricingPage: FC<PricingPageProps> = ({ }) => {
    return (
        <main className='w-full font-albert-sans min-h-screen bg-darkBg text-white pb-32'>
            <Header title='Pricing' />
            <div className='w-[40rem] mx-auto pt-2'>
                <p className='text-center text-5xl font-bold'>Monthly Subscription<br />for Labeled Dataset Credits</p>
                <p className='text-center mt-1 text-sm '>For developers,Startups, and small teams who need labeled data on a recurring basis.</p>
                <div className='flex items-start justify-center mt-3 w-full gap-3'>
                    <p className='text-sm'>Billed Yearly</p>
                    <Switch />
                    <p className='text-sm'>Billed Monthly</p>
                </div>
            </div>
            <div className='flex w-full items-center justify-center gap-8 mt-8'>
                <div className='w-[15rem] h-[27rem] bg-white flex flex-col items-center gap-4 p-6'>
                    <p className='font-semibold text-lg text-black'>Free</p>
                    <p className='text-5xl font-bold text-black'>$0</p>
                    <p className='text-sm text-[#747474] '>Free of cost</p>
                    <button className=' py-4 border-[3px] border-[#747474] text-[#747474] w-[95%]'>Current Plan</button>
                    <hr className='w-[60%] my-4 h-px bg-[#747474]' />
                    <p className='text-[#747474] text-sm'>20 credits/month</p>
                    <p className='text-[#747474] text-sm'>$2 per additional credit</p>
                </div>
                <div className='w-[15rem] h-[27rem] bg-white flex flex-col items-center gap-4 p-6'>
                    <p className='font-semibold text-lg text-black'>Starter</p>
                    <p className='text-5xl font-bold text-black'>$59</p>
                    <p className='text-sm text-[#747474] '>Billed Monthly</p>
                    <button className='w-[95%] py-4 border-[3px] border-bigRed text-bigRed'>Upgrade</button>
                    <hr className='w-[60%] my-4 h-px bg-[#747474]' />
                    <p className='text-[#747474] text-sm'>20 credits/month</p>
                    <p className='text-[#747474] text-sm'>$2 per additional credit</p>
                </div>
                <div className='w-[15rem] h-[27rem] bg-white flex flex-col items-center gap-4 p-6'>
                    <p className='font-semibold text-lg text-black'>Growth</p>
                    <p className='text-5xl font-bold text-black'>$229</p>
                    <p className='text-sm text-[#747474] '>Billed Monthly</p>
                    <button className='w-[95%] py-4 border-[3px] border-bigRed text-bigRed'>Upgrade</button>
                    <hr className='w-[60%] my-4 h-px bg-[#747474]' />
                    <p className='text-[#747474] text-sm'>20 credits/month</p>
                    <p className='text-[#747474] text-sm'>$2 per additional credit</p>
                </div>
                <div className='w-[15rem] h-[27rem] bg-white flex flex-col items-center gap-4 p-6'>
                    <p className='font-semibold text-lg text-black'>Enterprise</p>
                    <p className='text-center text-2xl font-bold text-black'>Custom pricing</p>
                    <p className='text-sm text-[#747474] '>Billed Monthly</p>
                    <button className='w-[95%] py-4 border-[3px] border-bigRed text-bigRed'>Upgrade</button>
                    <hr className='w-[60%] my-4 h-px bg-[#747474]' />
                    <p className='text-[#747474] text-sm'>20 credits/month</p>
                    <p className='text-[#747474] text-sm'>$2 per additional credit</p>
                </div>
            </div>
            <ul className='list-disc mx-auto my-4'>
                <li className='flex gap-2 justify-center'>
                    <p className='font-bold'>Annual Discounts:</p>
                    <p>15% off for Annual Subscriptions</p>
                </li>
                <li className='flex gap-2 justify-center'>
                    <p className='font-bold'>Add-ons:</p>
                    <p>API access, Role-based access control, priority customer support</p>
                </li>
            </ul>
        </main>
    )
}

export default PricingPage