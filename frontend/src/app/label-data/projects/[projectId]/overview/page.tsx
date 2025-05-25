import Header from '@/components/LabelData/Header'
import Instruction from '@/components/LabelData/Projects/Overview/Instruction';
import Overview from '@/components/LabelData/Projects/Overview/Overview'
import TaskTable from '@/components/LabelData/Projects/Overview/TaskTable';
import { getProject } from '@/lib/utils';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { FC } from 'react'


interface pageProps {
    params: Promise<{ projectId: string }>
}

export async function generateMetadata({
    params,
}: pageProps): Promise<Metadata> {
    const projectId = (await params).projectId;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const project = await getProject(refreshToken, accessToken, projectId)

    return {
        title: project ? `${project.name} - Overview` : `${projectId} - Overview`,
    };
}

const page: FC<pageProps> = async ({ params }) => {
    const projectId = (await params).projectId;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const project = await getProject(refreshToken, accessToken, projectId)

    const tasksOverviewAPI = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/task/overview/${projectId}`, {
        method: "GET",
        headers: {
            Cookie: `refreshToken=${refreshToken || ""};accessToken=${accessToken || ""
                }`,
        },
    })
    const tasksOverview = await tasksOverviewAPI.json();

    const datapointsOverviewAPI = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/datapoint/overview/${projectId}`, {
        method: "GET",
        headers: {
            Cookie: `refreshToken=${refreshToken || ""};accessToken=${accessToken || ""
                }`,
        },
    })
    const datapointsOverview = await datapointsOverviewAPI.json();

    const overviewData = {
        TotalTasks: tasksOverview.data?.totalTasks || 0,
        onGoingTasks: tasksOverview.data?.onGoingTasks || 0,
        completedTasks: tasksOverview.data?.completedTasks || 0,
        TotalDatapoints: datapointsOverview.data?.totalDatapoints || 0,
        onGoingDatapoints: datapointsOverview.data?.onGoingDatapoints || 0,
        completedDatapoints: datapointsOverview.data?.completedDatapoints || 0,
    }

    return (
        <>
            <Header title='Overview' />
            <div className='w-full px-8 py-2'>
                <Overview blobData={overviewData} />
                <Instruction project={project} projectId={projectId} />
                <TaskTable project={project} />
            </div>

        </>
    )
}

export default page