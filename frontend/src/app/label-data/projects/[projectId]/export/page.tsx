import ExportDatapoints from '@/components/LabelData/Projects/Export/ExportDatapoints';
import Header from '@/components/LabelData/Header';
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
        title: project ? `${project.name} - Export` : `${projectId} - Export`,
    };
}

const page: FC<pageProps> = async ({ params }) => {
    const projectId = (await params).projectId;
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const getTasksAPI = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/task/get-tasks/${projectId}`, {
        method: "GET",
        headers: {
            Cookie: `refreshToken=${refreshToken || ""};accessToken=${accessToken || ""
                }`,
        },
    })

    const getTasks = await getTasksAPI.json()

    return (
        <>
            <Header title='Export' key="Export" />
            <ExportDatapoints tasks={getTasks.tasks} projectId={projectId} />
        </>
    )
}

export default page