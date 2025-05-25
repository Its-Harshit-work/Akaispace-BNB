import { Globe } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import { motion } from "framer-motion";

interface ProjectCardProps {
    project: Project
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
    const tasks = project.tasks;
    const totalDatapoints = tasks.reduce((total, task) => (
        total + task.size
    ), 0)

    return (
        <div className='bg-[#2C2C2C] w-[320px] h-[260px] rounded-lg font-albert-sans border border-transparent hover:border hover:border-gray-600 transition-all duration-200 '>
            <Link href={`/label-data/projects/${project._id}/overview`} className='p-3 h-full flex flex-col gap-2 ' >
                <motion.div layoutId={`${project._id}-image`} className='w-full h-1/2 rounded-lg bg-white'>
                </motion.div>
                <div className='pl-1'>
                    <motion.p layoutId={`${project._id}-name`} className='text-xl text-white font-semibold'>
                        {project.name}
                    </motion.p>
                    <div className='text-gray-400'>
                        <p className='text-sm'>{totalDatapoints} Datapoints</p>
                    </div>
                    <div className='flex justify-start mt-2 gap-3'>
                        <div className='w-fit text-xs bg-bigRed text-white px-3 py-1 rounded-lg shadow shadow-gray-600'>
                            {project.type}
                        </div>
                    </div>
                </div>

            </Link>
        </div>

    )
}

export default ProjectCard