import { FC, ReactNode } from 'react'
import { cookies } from 'next/headers';
import { getProject, getUserData } from '@/lib/utils';
import ProjectSidebar from '@/components/LabelData/Projects/ProjectSidebar';


interface layoutProps {
    children: ReactNode
    params: Promise<{ projectId: string }>
}

const layout: FC<layoutProps> = async ({ children, params }) => {
    const projectId = (await params).projectId;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;


    const project = await getProject(refreshToken, accessToken, projectId)
    const userData = await getUserData(refreshToken, accessToken)
    return (
        <div className='w-full min-h-screen bg-darkBg flex'>
            <ProjectSidebar userData={userData.user} project={project} />
            <div className='min-h-screen flex-1 bg-darkBg'>
                {children}
            </div>
        </div>
    )
}

export default layout
