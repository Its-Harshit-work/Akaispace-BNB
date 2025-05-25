'use client'
import { FC, useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import IconBtn from '@/components/ui/IconBtn'
import { ClipboardPen, Download } from 'lucide-react'
import { Table, TableRow, TableHeader, TableBody, TableHead, TableCell } from '@/components/ui/table'
import { toast } from 'sonner'
import axios from 'axios'

interface DatasetDetailsProps {
    dataset: Dataset;
    user: User;
    datapoints: Datapoint[];
    projectName: string | undefined
}

const DatasetDetails: FC<DatasetDetailsProps> = ({ dataset, user, datapoints, projectName }) => {
    const [processingApi, setprocessingApi] = useState(false);


    const handleExpWithVideos = async () => {
        try {
            setprocessingApi(true)
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/project/export/with-videos`, {
                datapointIds: dataset.datapoints
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


            toast.success("Data Downloaded Successfully!")

        } catch (error) {
            console.error(error)
            toast.error("Something went wrong. Please try again!")
        }
        finally {
            setprocessingApi(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-darkBg px-8 py-4">
            <div className="flex flex-col gap-4">
                <div className='flex justify-between pr-20'>
                    <p className="text-3xl text-white font-bold">{dataset.name}</p>
                    <IconBtn onClick={handleExpWithVideos} disabled={processingApi} icon={<Download />} title='Download' />
                </div>
                <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        {dataset.upvotes} upvotes
                    </Badge>
                    <Badge variant="outline" className="border-border text-white bg-bigRed">
                        {dataset.license}
                    </Badge>
                </div>
            </div>
            {/* Description Section */}
            <div>
                <h3 className="text-lg font-semibold mt-2 text-white">Description</h3>
                <p className="text-muted-foreground">{dataset.description}</p>
            </div>

            <Separator className="bg-border my-4" />

            {/* Dataset Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Dataset Information</h3>
                    <div className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Project Name</p>
                            <p className="text-white">{projectName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Number of Datapoints</p>
                            <p className="text-white">{dataset.datapoints.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Created By</p>
                            <p className="text-white">{user.username}</p>
                        </div>
                    </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Timestamps</h3>
                    <div className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Created At</p>
                            <p className="text-white">{format(new Date(dataset.createdAt), 'PPP p')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <p className="text-white">{format(new Date(dataset.updatedAt), 'PPP p')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Table className='mt-3 bg-white rounded-lg w-full'>
                <TableHeader className='w-full'>
                    <TableRow className='w-full'>
                        <TableHead className="text-2xl font-normal ">
                            Sr. No.
                        </TableHead>
                        <TableHead className="text-2xl font-normal">
                            Video
                        </TableHead>
                        <TableHead className="text-2xl font-normal">
                            Description
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        datapoints.map((datapoint, index) => (
                            <TableRow key={datapoint._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className='flex justify-center '>
                                    <div className='overflow-hidden max-w-56 rounded-lg'>
                                        <video
                                            onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                                            onMouseLeave={(e) => {
                                                const video = e.target as HTMLVideoElement;
                                                video.pause();
                                                video.currentTime = 0;
                                            }}
                                            src={datapoint.mediaUrl}
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                            className=' rounded-lg hover:scale-110 transition-transform duration-200'
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>{datapoint.finalLabel}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default DatasetDetails