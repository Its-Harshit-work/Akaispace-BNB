import { FC, ReactNode } from 'react'
import clsx from 'clsx'


interface ProjectTypeProps {
    onClick: () => void,
    isSelected: boolean,
    title: string
    Icon: ReactNode,
    bgColor: string,
}

const ProjectType: FC<ProjectTypeProps> = ({ onClick, isSelected, title, Icon, bgColor }) => {
    return (
        <div onClick={onClick} className={clsx('w-full rounded-lg font-albert-sans p-3 flex items-center gap-4 border-2 ', isSelected ? 'border-pink-700' : 'border-gray-300 hover:border-slate-700')}>
            {Icon}
            <div className='flex flex-col gap-1'>
                <p className='text-lg -mb-2'>{title}</p>
                <p className='text-sm'>Assign labels for entire image</p>
                <div className='flex items-center gap-2 mt-2'>
                    <p className='text-xs'>Best for</p>
                    <div className='px-2 py-1 bg-bigRed text-white rounded-xl text-xs'>
                        Filtering
                    </div>
                    <div className='px-2 py-1 bg-bigRed text-white rounded-xl text-xs'>
                        Content Moderation
                    </div>
                </div>
            </div>


        </div>
    )
}

export default ProjectType