import { FC } from 'react'
import MarketplaceCard from './MarketplaceCard'

interface MarketplaceProps {
    datasets: Dataset[]
}

const Marketplace: FC<MarketplaceProps> = ({ datasets }) => {
    return (
        <div className='w-full font-albert-sans text-white px-16 pt-5 flex gap-5 flex-wrap'>
            {
                datasets.map((dataset) => (
                    <MarketplaceCard dataset={dataset} key={dataset._id} />
                ))
            }
        </div>
    )
}

export default Marketplace