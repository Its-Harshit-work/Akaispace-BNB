import React from 'react'
import { Skeleton } from '../../ui/skeleton'

const ProjectsSkeleton: React.FC = () => {
    return (
        <div className="flex flex-wrap w-full gap-4 px-16 py-4">
            {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="bg-gray-700 size-72  rounded-lg"></Skeleton>
            ))}
        </div>
    )
}

export default ProjectsSkeleton