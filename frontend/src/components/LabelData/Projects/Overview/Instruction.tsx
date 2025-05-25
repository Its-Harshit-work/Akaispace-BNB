'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader, Pen, Plus } from 'lucide-react'
import { FC, useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import { Input } from '@/components/ui/input'
import InputAkai from '@/components/ui/InputAkai'
import IconBtn from '@/components/ui/IconBtn'
import { toast } from 'sonner'
import axios from 'axios'

interface InstructionProps {
    projectId: string
    project: Project
}

const Instruction: FC<InstructionProps> = ({ projectId, project }) => {
    const [modal, setModal] = useState(false)
    const [mdValue, setMdValue] = useState(project.instruction?.markdown || "**Hello world!!!**");
    const [file, setFile] = useState<File | null>()
    const [label, setLabel] = useState(project.instruction?.label || '')
    const [videoPreview, setVideoPreview] = useState<string | null>(project.instruction?.video_url || null)
    const [loading, setLoading] = useState(false)


    const addInstruction = async () => {
        try {
            setLoading(true)
            if (label.trim() !== "" && mdValue.trim() !== "") {
                // Create FormData to send file and other data
                const formData = new FormData();
                if (file) {
                    formData.append('media', file);
                }
                formData.append('label', label);
                formData.append('markdown', mdValue);

                await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/project/add-instruction/${projectId}`,
                    formData,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                toast.success(project.instruction ? "Instruction Updated Successfully!" : "Instruction Added Successfully!")
            } else {
                toast.error("Please Fill All The Required Fields!")
            }
        } catch (error) {
            toast.error("Something Went Wrong. Please Try Again!")
            console.error(error)
        }
        finally {
            setLoading(false)
            setModal(false)
            if (!project.instruction) {
                setLabel('');
                setFile(null);
                setVideoPreview(null);
            }
        }
    }

    return (
        <>
            <div className='flex items-center justify-between text-white border border-red-900 min-w-[400px] max-w-xl px-5 py-3 my-4 rounded-md'>
                {
                    project.instruction ?
                        <>
                            <div>

                                <p className='font-semibold text-lg'>Instruction</p>
                                <p>Instruction has been added.</p>
                            </div>
                            <IconBtn onClick={() => setModal(true)} icon={<Pen />} title='Edit' />
                        </>
                        :
                        <>
                            <div>
                                <p className='font-semibold text-lg'>Add Instruction</p>
                                <p>Instructions helps us to label your data in a more personalized way</p>
                            </div>
                            <IconBtn onClick={() => setModal(true)} icon={<Plus />} title='Add' />
                        </>

                }

            </div>
            <Dialog open={modal} onOpenChange={(open) => {
                setModal(open)
            }}>
                <DialogContent className='w-[900px] px-10 py-5 font-albert-sans'>
                    <DialogHeader>
                        <DialogTitle>
                            {project.instruction ? 'Edit Instruction' : 'Add Instruction For Labeling'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className=''>
                        <MDEditor
                            value={mdValue}
                            onChange={(value) => setMdValue(value || "")}
                            enableScroll
                        />
                    </div>

                    <div className='flex items-center gap-6'>
                        <div className='flex-1'>
                            <label htmlFor="video">Upload Example Video</label>
                            <Input className='border border-bigRed mt-2' onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFile(file);
                                    const fileUrl = URL.createObjectURL(file);
                                    setVideoPreview(fileUrl);
                                }
                            }}
                                type='file'
                                accept='video/*' />
                            {videoPreview && (
                                <video
                                    src={videoPreview}
                                    controls
                                    className="mt-4 w-full max-h-[300px] rounded-md border"
                                />
                            )}
                        </div>
                        <div className='flex-1'>
                            <InputAkai value={label} onChange={(e) => setLabel(e.target.value)} title='Add Example Label' inputType='text' htmlFor='label' />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button disabled={loading} onClick={addInstruction} variant='akai' className=''>
                            {loading ?
                                <>
                                    <span className='animate-spin'><Loader fill='white' /></span>
                                    {project.instruction ? 'Updating' : 'Adding'}
                                </> : project.instruction ? "Update" : "Add"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Instruction