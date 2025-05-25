import DatasetDetails from '@/components/LabelData/Marketplace/DatasetDetails';
import { getDatasetById } from '@/lib/utils';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { FC } from 'react'

interface pageProps {
    params: Promise<{ datasetId: string }>
}

export async function generateMetadata({
    params,
}: pageProps): Promise<Metadata> {
    const datasetId = (await params).datasetId;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const dataset: Dataset = await getDatasetById(refreshToken, accessToken, datasetId)

    return {
        title: dataset ? `${dataset.name}` : `${datasetId}`,
    };
}

const getUserData = async (
    refreshToken: string | undefined,
    accessToken: string | undefined,
    userId: string
) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/get-user/${userId}`,
            {
                method: "GET",
                headers: {
                    Cookie: `refreshToken=${refreshToken || ""};accessToken=${accessToken || ""
                        }`,
                },
            }
        );
        const data = res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

const getDatapointById = async (
    refreshToken: string | undefined,
    accessToken: string | undefined,
    datapointIds: string[]
) => {
    const object = {
        datapointIds: datapointIds
    }
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/datapoint/get`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `refreshToken=${refreshToken || ""};accessToken=${accessToken || ""}`,
                },
                body: JSON.stringify(object)
            }
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

const page: FC<pageProps> = async ({ params }) => {
    const projectId = (await params).datasetId;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;


    const dataset: Dataset = await getDatasetById(refreshToken, accessToken, projectId)


    const userData: User = await getUserData(refreshToken, accessToken, dataset.user_id)

    const datapoints: Datapoint[] = await getDatapointById(refreshToken, accessToken, dataset.datapoints)

    const projectName = userData.projects.find((project) => project._id === dataset.project_id)?.name

    return (
        <>
            <DatasetDetails dataset={dataset} user={userData} datapoints={datapoints} projectName={projectName} />
        </>
    )
}

export default page