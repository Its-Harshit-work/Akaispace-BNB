import { Skeleton } from '@/components/ui/skeleton'
import { FC } from 'react'

interface loadingProps {

}

const loading: FC<loadingProps> = ({ }) => {
    return (
        <div className='w-full min-h-screen p-5'>
            <div className='mt-20'>
                <div className='w-full flex gap-5'>
                    <Skeleton className='w-2/5 flex-1 h-80 bg-slate-600' />
                    <Skeleton className='w-2/5 flex-1 h-80 bg-slate-600' />
                </div>
                <div className='w-full flex gap-3 mt-10'>
                    {
                        Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className='w-28 flex-1 h-60 bg-slate-600' />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default loading