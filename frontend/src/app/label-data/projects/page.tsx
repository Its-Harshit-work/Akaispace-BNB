import Header from '@/components/LabelData/Header'
import ProjectsPage from '@/components/LabelData/Projects/ProjectsPage'
import ProjectsSkeleton from '@/components/LabelData/Projects/ProjectsSkeleton'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { FC } from 'react'
import { Suspense } from 'react'

interface pageProps { }

export const metadata: Metadata = {
    title: "Projects - Akai Space"
}

const fetchUserData = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/get-user`, {
        method: 'POST',
        headers: {
            'Cookie': `refreshToken=${refreshToken};accessToken=${accessToken}`
        }
    });
    if (!res.ok) {
        console.error(res.statusText)
    }

    const rawUserData = await res.json();
    return rawUserData.user as User;
};

const PageContent = async () => {
    const userData = await fetchUserData();

    return (
        <ProjectsPage projects={userData.projects} user={userData} />
    );
};

const Page: FC<pageProps> = async ({ }) => {
    return (
        <div className='flex-1 min-h-screen bg-darkBg'>
            <Header title='Projects' />
            <Suspense fallback={<ProjectsSkeleton />}>
                <PageContent />
            </Suspense>
        </div>
    )
}

export default Page