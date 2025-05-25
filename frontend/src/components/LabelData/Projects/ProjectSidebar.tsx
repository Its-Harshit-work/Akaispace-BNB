'use client'
import { ChartLine, CloudDownload, Globe } from 'lucide-react'
import { FC } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import SideLink from '@/components/SideLink'
interface ProjectSidebarProps {
    project: Project
    userData: User
}

const ProjectSidebar: FC<ProjectSidebarProps> = ({ project, userData }) => {
    const pathname = usePathname();
    const urlArray = pathname.split('/');
    return (
        <div className='bg-[#D2D2D2] min-h-screen w-[15%] p-4'>
            <p className='font-semibold'>{userData.username}&apos;s Workspace</p>
            <div className='mt-4 mx-auto mb-2 h-32'>
                <motion.div layoutId={`${project._id}-image`} className='bg-white w-full h-28' />
                <motion.p layoutId={`${project._id}-name`} className='text-lg mt-2 font-semibold'>{project.name}</motion.p>
            </div>
            <div className='mt-10'>
                <p className='text-xl font-medium'>DATA</p>
                <div className='pl-2 flex flex-col gap-6 mt-6'>
                    <SideLink active={urlArray.includes('overview')} className='w-full' linkClassName='w-24 gap-2 ml-2' hrClassName='w-[85%]' icon={<Globe />} link={`/label-data/projects/${project._id}/overview`} title='Overview' key='Overview' />
                    <SideLink active={urlArray.includes('analytics')} className='w-full' linkClassName='w-24 gap-2 ml-2' hrClassName='w-[85%]' icon={<ChartLine />} link={`/label-data/projects/${project._id}/analytics`} title='Analytics' key='Analytics' />
                    <SideLink active={urlArray.includes('export')} className='w-full' linkClassName='w-24 gap-2 ml-2' hrClassName='w-[85%]' icon={<CloudDownload />} link={`/label-data/projects/${project._id}/export`} title='Export' key='Export' />
                </div>
            </div>
        </div>
    )
}

export default ProjectSidebar
