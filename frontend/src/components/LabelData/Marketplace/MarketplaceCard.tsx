import { FC } from 'react'
import { motion } from "framer-motion"
import Link from 'next/link'

interface MarketplaceCardProps {
    dataset: Dataset
    onUpvote?: (id: string) => void
}

const MarketplaceCard: FC<MarketplaceCardProps> = ({ dataset, onUpvote, ...props }) => {
    return (
        <div className='bg-[#2C2C2C] w-[280px] h-[200px] rounded-lg font-albert-sans border border-transparent hover:border hover:border-gray-600 transition-all duration-200 '>
            <Link href={`/label-data/marketplace/${dataset._id}`} className='' >
                <div className='w-full h-1/2 rounded-t-lg bg-white'>
                </div>
                <div className='pl-2 pt-1'>
                    <p className='text-lg text-white font-semibold'>
                        {dataset.name}
                    </p>
                    <div className='text-gray-400 text-sm'>
                        {dataset.description}
                    </div>
                    <div className='flex justify-start mt-2 gap-6 '>
                        <div className='w-fit text-xs bg-bigRed text-white px-3 py-1 rounded-lg shadow shadow-gray-600'>
                            {dataset.license}
                        </div>
                        <div className='text-gray-400'>
                            {dataset.datapoints.length} datapoints
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default MarketplaceCard
