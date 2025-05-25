import { FC } from 'react'
import DataBlob from './DataBlob'

interface OverviewData {
    TotalTasks: number,
    onGoingTasks: number,
    completedTasks: number,
    TotalDatapoints: number,
    onGoingDatapoints: number,
    completedDatapoints: number
}

interface OverviewProps {
    blobData: OverviewData
}

const Overview: FC<OverviewProps> = ({ blobData }) => {
    const tasksDataObj =
        [
            {
                title: "Total Tasks",
                value: blobData.TotalTasks || 0
            },
            {
                title: "On-Going Tasks",
                value: blobData.onGoingTasks || 0
            },
            {
                title: "Completed Tasks",
                value: blobData.completedTasks || 0
            },
        ]

    const datapointsDataObj =
        [
            {
                title: "Total Datapoints",
                value: blobData.TotalDatapoints || 0
            },
            {
                title: "On-Going Datapoints",
                value: blobData.onGoingDatapoints || 0
            },
            {
                title: "Completed Datapoints",
                value: blobData.completedDatapoints || 0
            },
        ]

    return (
        <div className=' text-white font-albert-sans'>
            <div className='w-full flex items-center gap-5 mt-2'>
                <div className='flex-1 '>
                    <h1 className='text-xl'>
                        Tasks Progress
                    </h1>
                    <div className='flex items-center gap-2 mt-2'>
                        {
                            tasksDataObj.map((t) => (
                                <DataBlob key={t.title} title={t.title} value={t.value} />
                            ))
                        }
                    </div>
                </div>
                <div className='flex-1'>
                    <h1 className='text-xl'>
                        Datapoints Progress
                    </h1>
                    <div className='flex items-center gap-2 mt-2'>
                        {
                            datapointsDataObj.map((d) => (
                                <DataBlob key={d.title} title={d.title} value={d.value} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview