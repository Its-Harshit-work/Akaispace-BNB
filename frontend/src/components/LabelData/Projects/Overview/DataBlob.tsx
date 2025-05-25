import { FC } from 'react'

interface DataBlobProps {
    value: number,
    title: string
}

const DataBlob: FC<DataBlobProps> = ({ title, value }) => {
    return (
        <div className='bg-gradient-to-b hover:opacity-95 from-rose-800 to-red-950 flex-1 h-28 rounded-xl flex flex-col items-center justify-center gap-3 border border-slate-700 hover:bg-slate-800'>
            <div className='text-white text-2xl font-semibold'>{value}</div>
            <div className='text-red-100'>
                {title}
            </div>
        </div>
    )
}

export default DataBlob