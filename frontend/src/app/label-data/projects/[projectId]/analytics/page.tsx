import Analytics from '@/components/LabelData/Projects/Analytics/Analytics';
import Header from '@/components/LabelData/Header';
import { getProject } from '@/lib/utils';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { FC, Suspense } from 'react'

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
        title: project ? `${project.name} - Analytics` : `${projectId} - Analytics`,
    };
}

const page: FC<pageProps> = async ({ params }) => {
    const projectId = (await params).projectId;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const project = await getProject(refreshToken, accessToken, projectId)
    return (
        <>
            <Header title='Analytics' />
            <Suspense fallback={<p>Loading</p>}>
                <Analytics project={project} />
            </Suspense>
        </>
    )
}

export default page