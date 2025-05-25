'use client'
import { Progress } from '@/components/ui/progress'
import { Info } from 'lucide-react'
import { FC } from 'react'


interface UsageDetailsProps {

}

const UsageDetails: FC<UsageDetailsProps> = ({ }) => {
    return (
        <div className='font-albert-sans w-full text-white mt-7'>
            <div>
                <p className='font-semibold text-2xl'>Usage Details</p>
                <div className='mt-2'>
                    <div className="grid grid-cols-6 gap-8 items-center">
                        <div className='flex items-center col-span-2 gap-3'>
                            <p>Pre-Labelling Credit</p>
                            <Info className='text-white size-5' />
                        </div>
                        <Progress value={60} className='w-full col-span-2' />
                        <p>{264}/{1000}</p>
                    </div>
                    <div className="grid grid-cols-6 gap-8 items-center mt-4">
                        <div className='flex items-center col-span-2 gap-3'>
                            <p>Auto-Labelling Credit</p>
                            <Info className='text-white size-5' />
                        </div>
                        <Progress value={80} className='w-full col-span-2' />
                        <p className="col-span-1" >{294}/{1000}</p>
                    </div>
                </div>
            </div>
            <hr className=' bg-white w-[80%] h-[0.5px] my-8' />
            <div className='mt-4'>
                <p className='font-semibold text-2xl'>Workspace Usage</p>
                <div className='mt-2'>
                    <div className="grid grid-cols-6 gap-8 items-center">
                        <div className='flex items-center col-span-2 gap-3'>
                            <p>Source Data</p>
                            <Info className='text-white size-5' />
                        </div>
                        <Progress value={60} className='w-full col-span-2' />
                        <p>{111}/{1000}</p>
                    </div>
                    <div className="grid grid-cols-6 gap-8 items-center mt-4">
                        <div className='flex items-center col-span-2 gap-3'>
                            <p>Projects</p>
                            <Info className='text-white size-5' />
                        </div>
                        <Progress value={20} className='w-full col-span-2' />
                        <p>{2}/{5}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsageDetails