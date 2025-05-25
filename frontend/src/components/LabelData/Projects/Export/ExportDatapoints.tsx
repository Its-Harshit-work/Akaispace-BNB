'use client'
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import IconBtn from '@/components/ui/IconBtn';
import InputAkai from '@/components/ui/InputAkai';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { publishInputSchema } from '@/lib/validations/publish-dataset';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { FileDown, FolderDown, Loader, Share2 } from 'lucide-react';
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ExportDatapointsProps {
  tasks: Task[];
  projectId: string
}
type FormData = z.infer<typeof publishInputSchema>;

const ExportDatapoints: FC<ExportDatapointsProps> = ({ tasks, projectId }) => {
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [datapoints, setDatapoints] = useState<Datapoint[]>([])
  const [selectedDatapoints, setSelectedDatapoints] = useState<Record<string, Datapoint[]>>({});
  const [selectAllToggle, setSelectAllToggle] = useState<Record<string, boolean>>({});
  const [loadingDatapoints, setLoadingDatapoints] = useState(false);
  const [processingApi, setprocessingApi] = useState(false);
  const [publishDialog, setPublishDialog] = useState(false)

  useEffect(() => {
    const fetchDatapoints = async () => {
      try {
        setLoadingDatapoints(true)
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/datapoint/get-datapoints/${selectedTask?._id}`, {
          withCredentials: true
        });
        const data = res.data;
        setDatapoints(data.datapoints)
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
      finally {
        setLoadingDatapoints(false)
      }
    }
    if (selectedTask) {
      fetchDatapoints()
    }
  }, [selectedTask])

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(publishInputSchema),
  });



  const toggleDatapointSelection = (datapoint: Datapoint) => {
    if (!selectedTask) return;


    setSelectedDatapoints(prev => {
      const currentTaskSelections = prev[selectedTask._id] || [];
      const isSelected = currentTaskSelections.some(dp => dp._id === datapoint._id);

      return {
        ...prev,
        [selectedTask._id]: isSelected
          ? currentTaskSelections.filter(dp => dp._id !== datapoint._id)
          : [...currentTaskSelections, datapoint]
      };
    });
  };

  const isDatapointSelected = (datapoint: Datapoint) => {
    if (!selectedTask) return false;
    return (selectedDatapoints[selectedTask._id] || []).some(dp => dp._id === datapoint._id);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selectedTask) return;

    setSelectAllToggle(prev => ({ ...prev, [selectedTask._id]: checked }));
    setSelectedDatapoints(prev => ({
      ...prev,
      [selectedTask._id]: checked ? [...datapoints] : []
    }));
  };

  // Update selectAllToggle when selection changes
  useEffect(() => {
    if (!selectedTask || datapoints.length === 0) return;

    const currentSelections = selectedDatapoints[selectedTask._id] || [];
    const allSelected = datapoints.every(dp =>
      currentSelections.some(selectedDp => selectedDp._id === dp._id)
    );

    setSelectAllToggle(prev => ({ ...prev, [selectedTask._id]: allSelected }));
  }, [selectedDatapoints, datapoints, selectedTask]);

  const totalDatapoints = selectedDatapoints ?
    Object.values(selectedDatapoints).reduce((sum, datapointArray) => sum + datapointArray.length, 0)
    :
    0

  const handleExpWithVideos = async () => {
    const allSelectedDatapoints = Object.values(selectedDatapoints).flat()
    const selectedDatapointIds = allSelectedDatapoints.map(dp => dp._id)
    try {
      setprocessingApi(true)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/project/export/with-videos`, {
        datapointIds: selectedDatapointIds
      },
        {
          withCredentials: true,
          responseType: 'blob'
        })

      // Create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from content-disposition header or use a default
      const contentDisposition = res.headers['content-disposition'];
      let fileName = 'datapoints_export.zip';

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch.length > 1) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 100);

      // Clear all datapoint-related states
      setDatapoints([]);
      setSelectedDatapoints({});
      setSelectAllToggle({});
      setSelectedTask(undefined);

      toast.success("Data Downloaded Successfully!")

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again!")
    }
    finally {
      setprocessingApi(false)
    }
  }


  const handleExpWithoutVideos = async () => {
    const allSelectedDatapoints = Object.values(selectedDatapoints).flat()
    try {
      setprocessingApi(true)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/project/export/without-videos`, {
        datapoints: allSelectedDatapoints
      },
        {
          withCredentials: true,
          responseType: 'blob'
        })

      // Create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from content-disposition header or use a default
      const contentDisposition = res.headers['Content-Disposition'];
      let fileName = 'datapoints_export.zip';

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch.length > 1) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 100);

      // Clear all datapoint-related states
      setDatapoints([]);
      setSelectedDatapoints({});
      setSelectAllToggle({});
      setSelectedTask(undefined);

      toast.success("Data Downloaded Successfully!")

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again!")
    }
    finally {
      setprocessingApi(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const allSelectedDatapoints = Object.values(selectedDatapoints).flat();
      let datapointIds = allSelectedDatapoints.map((dp) => dp._id)
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/dataset/add`, {
        name: data.name,
        description: data.description,
        license: data.license,
        project_id: projectId,
        datapoints: datapointIds
      }, {
        withCredentials: true
      })

      // Clear all datapoint-related states
      setDatapoints([]);
      setSelectedDatapoints({});
      setSelectAllToggle({});
      setSelectedTask(undefined);

      toast.success("Data Added to Marketplace Successfully!")
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("name", { message: error.message });
        setError("description", { message: error.message });
        setError("license", { message: error.message });
        return;
      }
      else if (error instanceof AxiosError) {
        toast.error(error.response?.data.message)
        console.log(error);
      }
      else {
        toast.error("Something went wrong. Please try again later.");
        console.log(error);
      }
    }
    finally {
      reset();
      setPublishDialog(false)
    }
  }


  return (
    <div className='w-full px-8 pb-2 py-1  text-white flex gap-8 font-albert-sans'>
      <div className=' max-w-xs min-w-[280px] px-2 flex flex-col gap-2 h-fit rounded-lg pb-4 pt-2 bg-[#303030] '>
        <p className='text-lg font-semibold'>Tasks</p>
        {
          tasks.map((task) => {
            const isActive = selectedTask?._id === task._id
            const isSelected = selectedDatapoints[task._id]?.length > 0
            return (
              <div onClick={() =>
                setSelectedTask(task)
              } className={`border-2 ${isActive ? 'border-bigRed' : 'border-slate-700'} ${isSelected ? 'bg-red-900' : 'bg-transparent'}  rounded-lg p-2 hover:cursor-pointer`} key={task._id}>{task._id}</div>
            )
          })
        }
      </div>

      <div className='bg-[rgb(48,48,48)] flex-1 rounded-lg px-5 pb-3 pt-1'>
        {
          selectedTask && (
            loadingDatapoints ?
              (<Skeleton className='w-96 h-10 bg-slate-600 my-3' />) : (
                <div className='flex w-full gap-5 my-3'>
                  <div className={` gap-2 flex`}>
                    <Checkbox disabled={processingApi} checked={selectedTask ? selectAllToggle[selectedTask._id] || false : false}
                      onCheckedChange={handleSelectAll} className={` border-2 border-slate-400 h-6 w-6 data-[state=checked]:bg-bigRed `} />
                    <h1>Select All</h1>
                  </div>
                  <div className=' flex '>
                    {
                      selectedTask &&
                      <div className='ml-14'>
                        {selectedDatapoints[selectedTask?._id]?.length || 0} of {datapoints.length} selected
                      </div>
                    }
                  </div>
                </div>
              )
          )
        }


        <div className=' flex-1 flex flex-wrap gap-5 '>
          {
            selectedTask ? (
              loadingDatapoints ? (
                // Loading skeletons
                Array(4).fill(0).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-64 max-w-xs h-[180px] bg-slate-600"
                  />
                ))
              ) : datapoints?.length > 0 ? (
                datapoints?.map((datapoint) => {
                  const isSelected = isDatapointSelected(datapoint);

                  return (
                    <div
                      key={datapoint._id}
                      className={`w-64 max-w-xs relative group transition-all duration-200 rounded-md ${isSelected ? 'ring-2 ring-bigRed' : ''
                        }`}
                    >
                      <video
                        src={datapoint.mediaUrl}
                        className={`bg-white/50 ${isSelected ? 'opacity-80' : ''} rounded-md`}
                        controls={false}
                      />
                      {/* Dark overlay that appears on hover */}
                      <div className={`absolute rounded-md inset-0 ${isSelected ? 'bg-gradient-to-b  from-black/80 to-transparent' : 'bg-transparent'}  group-hover:bg-gradient-to-b group-hover:from-black/80 group-hover:to-transparent transition-all duration-300`}>
                        <Checkbox
                          disabled={processingApi}
                          checked={isSelected}
                          onCheckedChange={() => toggleDatapointSelection(datapoint)}
                          className={`absolute top-2 left-2 bg-transparent border-2 border-slate-400 h-5 w-5 data-[state=checked]:bg-bigRed ${isSelected ? 'block' : 'group-hover:block hidden'
                            }`}
                        />
                        <p className={`text-xs truncate mt-2.5 pr-1 ml-8 ${isSelected ? 'block' : 'group-hover:block hidden'
                          }`}>{datapoint.mediaUrl.split('/')[6]}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="w-full text-center py-8">
                  <h1 className="text-xl font-semibold text-gray-400">No datapoints found for this task.</h1>
                </div>
              )
            ) : (
              <h1 className='text-xl font-semibold text-white mt-3'>Select a Task to display Datapoints.</h1>
            )
          }
        </div>
      </div>
      <div className={`z-10 fixed bottom-0 right-10 rounded-t-lg bg-red-50 text-black px-5 py-2 min-w-[520px] max-w-xl h-[100px] transition-all duration-300 ease-in-out ${totalDatapoints > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
        <h1 className='text-lg font-semibold'>Total Selected Datapoints: {totalDatapoints}</h1>
        <div className='flex gap-2 mt-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconBtn onClick={() => setPublishDialog(true)} disabled={processingApi} icon={<Share2 />} title='Publish' />
              </TooltipTrigger>
              <TooltipContent>
                Publish Selected Datapoints to the Marketplace
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconBtn disabled={processingApi} onClick={handleExpWithVideos} icon={<FolderDown />} title='Export' />
              </TooltipTrigger>
              <TooltipContent>
                Exports the Videos along with it's labels
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconBtn onClick={handleExpWithoutVideos} disabled={processingApi} icon={<FileDown />} title='Export only Labels' />
              </TooltipTrigger>
              <TooltipContent>
                Exports only the Labels without Videos
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Dialog open={publishDialog} onOpenChange={setPublishDialog} >
        <DialogContent className='w-[600px] max-w-4xl px-10 py-5 font-albert-san'>
          <DialogHeader>
            <DialogTitle>
              Fill the Form To Publish to Marketplace
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className='max-w-lg flex flex-col gap-3' >
            <InputAkai {...register("name")} type='text' error={errors.name?.message} htmlFor='name' title='Name' />
            <InputAkai {...register("description")} type='text' error={errors.description?.message} htmlFor='description' title='Description' />
            <InputAkai {...register("license")} type='text' error={errors.license?.message} htmlFor='license' title='License' />
            <Button disabled={isSubmitting} type='submit' variant='akai' className=''>
              {isSubmitting ?
                <>
                  <span className='animate-spin'><Loader fill='white' /></span>Publishing...
                </> : " Publish to Marketplace"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div >
  )
}

export default ExportDatapoints