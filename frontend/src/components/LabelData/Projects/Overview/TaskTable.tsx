'use client'
import { FC, useState, useEffect, useRef } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios, { AxiosError } from 'axios'
import { Box, Calendar, ChevronLeft, ChevronRight, ClipboardList, ClipboardPen, Clock, FolderUp, LineChart, RefreshCw, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { calculateFileHash } from '@/lib/utils'
import IconBtn from '@/components/ui/IconBtn'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

type TaskData = {
    taskId: string,
    size: number,
    stage: string,
    progress: number,
    startOn: string,
    duration: number,
}

interface UploadedFiles {
    fileName: string,
    fileUrl: string,
    size: number,
    hash: string
}

interface TaskTableProps {
    project: Project
}

const TaskTable: FC<TaskTableProps> = ({ project }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tasksData, setTasksData] = useState<TaskData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [progressText, setprogressText] = useState('');
    const [uploadError, setUploadError] = useState<Error | undefined>();

    const itemsPerPage = 10;



    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/task/progress/${project._id}`, {
                withCredentials: true
            });
            const data = res.data;
            // Sort by duration in descending order
            const sortedData = data.tasksWithStages.sort((a: TaskData, b: TaskData) => b.duration - a.duration);
            setTasksData(sortedData);
        } catch (error) {
            toast.error("Something went wrong! Please try again later.")
            console.error("Error fetching analytics data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();


    }, []);

    const totalPages = Math.ceil(tasksData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTasks = tasksData.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        handleUpload(files)
    };

    const handleUpload = async (files: File[]) => {
        setUploadLoading(true)
        if (files.length === 0) {
            toast.error("Please select files first.");
            return;
        }
        setUploadProgress(10);
        setprogressText("Preparing to Upload Files")
        try {
            let isSaveUploadedFilesCalled = false;

            // Step 1: Create task and get pre-signed URLs
            const createTaskAndPreSignedUrlAPI = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/task/create`;
            const fileNames = files.map((file) => file.name);

            const { data: presignedData } = await axios.post(
                createTaskAndPreSignedUrlAPI,
                {
                    projectId: project._id,
                    size: files.length,
                    startOn: new Date().toISOString(),
                    creditsNeeded: 10,
                    fileNames,
                },
                {
                    withCredentials: true,
                }
            );

            const { taskId, urls } = presignedData;
            const uploadedFiles: UploadedFiles[] = [];
            setUploadProgress(20);
            setprogressText("Uploading Files to Cloud")

            // Step 2: Upload files to S3 using the pre-signed URLs
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const presignedUrl = urls.find(
                    (u: any) => u.fileName === file.name
                ).url;

                await axios.put(presignedUrl, file, {
                    headers: { "Content-Type": file.type },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            // Calculate progress for current file (0-100)
                            const fileProgress = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );

                            // Calculate overall progress:
                            // - 20 is our starting point (after getting presigned URLs)
                            // - 70 is the range we want to distribute across all files (20 to 90)
                            // - (i / files.length) is the progress through the file list
                            // - (fileProgress / 100) is the progress within the current file
                            const overallProgress = 20 +
                                (70 * (i / files.length)) +
                                (70 * (fileProgress / 100) / files.length);

                            setUploadProgress(Math.min(90, overallProgress));
                        }
                    }
                });
                const size = file.size;
                const hash = await calculateFileHash(file);

                const fileUrl = presignedUrl.split("?")[0];
                uploadedFiles.push({ fileName: file.name, fileUrl, size, hash });
            }

            setTimeout(async () => {
                if (!isSaveUploadedFilesCalled) {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_BACKEND_HOST}/task/upload-complete`,
                        {
                            projectId: project._id,
                            taskId: taskId,
                            uploadedFiles: uploadedFiles,
                        },
                        {
                            withCredentials: true,
                        }
                    );
                    toast.info(response.data.message)
                }
            }, 300000);


            // Step 3: Notify backend that upload is complete
            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/task/upload-complete`,
                    {
                        projectId: project._id,
                        taskId: taskId,
                        uploadedFiles: uploadedFiles,
                    },
                    {
                        withCredentials: true,
                    }
                );
                setprogressText("Files Uploaded Successfully")
                setUploadProgress(100);

                isSaveUploadedFilesCalled = true
            } catch (error) {
                setUploadError(error instanceof Error ? error : new Error(String(error)))
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/task/delete`,
                    {
                        projectId: project._id,
                        taskId: taskId,
                        uploadedFiles: uploadedFiles,
                    },
                    {
                        withCredentials: true,
                    })
                isSaveUploadedFilesCalled = true;
                setprogressText("Roll-back Completed! Please Upload Files Again");
            }

        } catch (error) {
            setUploadError(error instanceof Error ? error : new Error(String(error)))
            console.log("Error while uploading files", error);
            setprogressText("Something went wrong! Please try again later.")
        } finally {
            setTimeout(() => {
                setUploadLoading(false)
                fetchData();
                setUploadProgress(0);
                setprogressText("")
                setUploadError(undefined)
            }, 2000)
        }
    };

    const startPreLabel = async (taskId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/task/start-prelabel`, {
                taskId: taskId,
                projectId: project._id
            }, {
                withCredentials: true
            })
            toast.success("Started Pre-Labeling")
        } catch (error) {
            console.error("Failed to start Pre Label Process", error);
            toast.error("Something Went Wrong. Please Try Again!")
        }
        finally {
            fetchData()
        }
    }

    return (
        <div className='mt-8 relative'>
            <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                onChange={handleFileChange}
                accept={project.type === "video" ? "video/*" :
                    project.type === "image" ? "image/*" :
                        project.type === "audio" ? "audio/*" :
                            ""}

            />
            <div className='flex justify-between w-full'>
                <p className='text-white text-3xl font-normal flex items-center gap-2'>
                    <Clock size={30} />
                    Tasks in Progress
                </p>
                <div className='flex gap-3'>
                    <IconBtn
                        disabled={uploadLoading}
                        className=""
                        icon={<FolderUp />}
                        title="Add Task"
                        onClick={() => fileInputRef.current?.click()}
                    />
                    <IconBtn disabled={isLoading} icon={<RefreshCw />} onClick={fetchData} title='Refresh' />
                </div>
            </div>

            <div className={`fixed z-10 bottom-0 right-5 bg-slate-300 rounded-t-lg max-w-md w-[400px] h-24 px-5 py-2 transition-all duration-300 ease-in-out ${uploadLoading ? 'translate-y-0' : 'translate-y-full'
                }`}>
                {uploadError ?
                    <h1 className='font-semibold text-bigRed'>Error</h1>
                    :
                    <h1 className='font-semibold text-slate-700' >Uploading Files</h1>
                }

                {!uploadError && <Progress value={uploadProgress} className='mt-2' />}
                <h1 className='mt-2 font-semibold'>{progressText}</h1>
            </div>


            <Table className='mt-3 bg-white rounded-lg w-full'>
                <TableHeader className='w-full'>
                    <TableRow className='w-full'>
                        <TableHead className="text-2xl font-normal">
                            <div className='flex items-center justify-center gap-2'>
                                <ClipboardList size={20} />
                                Task ID
                            </div>
                        </TableHead>
                        <TableHead className="text-2xl font-normal">
                            <div className='flex items-center justify-center gap-2'>
                                <Box size={20} />
                                Size
                            </div>
                        </TableHead>
                        <TableHead className="text-2xl font-normal">
                            <div className='flex items-center justify-center gap-2'>
                                <Tag size={20} />
                                Stage
                            </div>
                        </TableHead>
                        <TableHead className="text-2xl font-normal">
                            <div className='flex items-center justify-center gap-2'>
                                <LineChart size={20} />
                                Progress
                            </div>
                        </TableHead>
                        <TableHead className="text-2xl font-normal">
                            <div className='flex items-center justify-center gap-2'>
                                <Calendar size={20} />
                                Start On
                            </div>
                        </TableHead>
                        <TableHead className="text-2xl font-normal">
                            <div className='flex items-center justify-center gap-2'>
                                <Clock size={20} />
                                Duration
                            </div>
                        </TableHead>
                        <TableHead className="text-2xl font-normal">
                            <div className='flex items-center justify-center gap-2'>
                                <ClipboardPen size={20} />
                                Action
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !isLoading ? currentTasks.map((row) => (
                            <TableRow key={row.taskId}>
                                <TableCell className="">{row.taskId}</TableCell>
                                <TableCell>{row.size}</TableCell>
                                <TableCell>{row.stage}</TableCell>
                                <TableCell className="">{Math.round(row.progress)}%</TableCell>
                                <TableCell className="">{row.startOn}</TableCell>
                                <TableCell className="">{row.duration} hrs</TableCell>
                                <TableCell className="">
                                    <Button size='sm' className='bg-red-900' disabled={row.stage !== "created"} onClick={() => startPreLabel(row.taskId)}>Start Labelling</Button>
                                </TableCell>
                            </TableRow>
                        ))
                            :
                            (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 7 }).map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="w-full h-5" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )
                    }
                </TableBody>
            </Table>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-white">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(endIndex, tasksData.length)}</span> of{" "}
                    <span className="font-medium">{tasksData.length}</span> entries
                </div>
                <div className="space-x-2 flex items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="bg-white"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="bg-white"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TaskTable