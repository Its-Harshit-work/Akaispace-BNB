'use client'
import { FC, useEffect, useState } from 'react'
import LineChart from './LineChart'
import axios, { AxiosError } from 'axios'
import CustomGauge from './CustomGuage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AnalyticsProps {
  project: Project
}

type TaskData = {
  taskId: string,
  datapointsFinalLabeled: number,
  percentageFinalLabeled: number,
  totalDatapoints: number,
}

type AnalyticsData = {
  datasetName: string,
  preLabelList: number[],
  finalLabelList: number[],
  datapointStats: {
    totalDatapoints: number,
    finalLabeledDatapoints: number,
    finalLabeledPercentage: number,
  },
  taskStats: TaskData[]
}

const Analytics: FC<AnalyticsProps> = ({ project }) => {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_HOST}/project/project-analytics/${project._id}`, {
          withCredentials: true
        }
        );
        setAnalyticsData(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.status === 401 || error.status === 403) {
            toast.info("Session Timed out. Please Login.")
            router.replace('/auth/login');
          }
          else {
            toast.error("Something went wrong! Please try again later.")
            console.error("Error fetching analytics data:", error);
          }
        }
        else {
          toast.error("Something went wrong! Please try again later.")
          console.error("Error fetching analytics data:", error);
        }
      }
    };

    fetchAnalyticsData();
  }, [project]);

  const preLabelData = analyticsData?.preLabelList || [];
  const FinalLabelData = analyticsData?.finalLabelList || [];

  return (
    <div className='px-5 py-2 pb-20 min-h-screen font-albert-sans'>
      <div className='flex gap-10 w-full mb-10'>
        <div className='flex-1'>
          <p className='text-white ml-4 text-2xl mb-3'>Live-Labelling</p>
          <LineChart numberOfHours={24} key="Live-Labelling" dataColor='rgba(20, 89, 245, 1)' dataPoints={FinalLabelData} />
        </div>
        <div className='flex-1'>
          <p className='text-white ml-4 text-2xl mb-3'>Pre-Labelling</p>
          <LineChart numberOfHours={12} key="Pre-Labelling" dataColor='rgba(207, 11, 33, 1)' dataPoints={preLabelData} />
        </div>
      </div>
      <div className='flex justify-around font-albert-sans w-full px-10'>
        <div className='w-[30%]'>
          <p className='text-white text-2xl px-2 mb-5'>Dataset Progress</p>
          {analyticsData && (
            <>
              <CustomGauge
                percentage={analyticsData.datapointStats.finalLabeledPercentage}
                className="w-[220px]"
              />
              <div className='pl-14'>
                <div className='flex items-center gap-2 mt-2 text-white '>
                  <div className='bg-bigRed size-4 rounded-full' />
                  <p>Completed</p>
                  <p className='text-gray-500'>{analyticsData.datapointStats.finalLabeledDatapoints}</p>
                </div>
                <div className='flex items-center gap-2 mt-2 text-white '>
                  <div className='bg-white size-4 rounded-full' />
                  <p>Remaining</p>
                  <p className='text-gray-500'>
                    {analyticsData.datapointStats.totalDatapoints - analyticsData.datapointStats.finalLabeledDatapoints}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='w-[70%]'>
          <div className='flex items-center justify-between mb-5 px-10'>
            <p className='text-white text-2xl '>Task Progress</p>
            <Link href={`/label-data/projects/${project._id}/overview`} className='text-white hover:underline hover:underline-offset-2 cursor-pointer'>Show more</Link>
          </div>
          <div className='flex w-full justify-evenly items-center flex-wrap'>
            {analyticsData && analyticsData?.taskStats.length > 0 &&
              analyticsData?.taskStats.slice(-3).map((data) => (
                <div className='' key={data.taskId} >
                  <CustomGauge
                    percentage={data.percentageFinalLabeled}
                    className="w-[220px]"
                  />
                  <div className='w-full flex flex-col items-center justify-center'>
                    <div className='flex items-center gap-2 mt-2 text-white '>
                      <div className='bg-bigRed size-4 rounded-full' />
                      <p>Completed</p>
                      <p className='text-gray-500'>{data.datapointsFinalLabeled}</p>
                    </div>
                    <div className='flex items-center gap-2 mt-2 text-white '>
                      <div className='bg-white size-4 rounded-full' />
                      <p>Remaining</p>
                      <p className='text-gray-500'>{data.totalDatapoints - data.datapointsFinalLabeled}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
