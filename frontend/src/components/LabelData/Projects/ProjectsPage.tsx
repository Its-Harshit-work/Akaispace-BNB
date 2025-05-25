'use client'
import { FC, useState } from 'react'
import IconBtn from '../../ui/IconBtn'
import ProjectCard from './ProjectCard'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import Classification from '../../ProjectType/ProjectType'
import { Button } from '../../ui/button'
import { Plus, Video, Image, FileMusic, Cross, X, Loader, Bitcoin, CircleDollarSign, HandCoins } from 'lucide-react'
import { z } from 'zod'
import { projectInputSchema } from '@/lib/validations/project-input'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import NextImage from 'next/image';
import InputAkai from '../../ui/InputAkai'
import ProjectType from '../../ProjectType/ProjectType'

interface ProjectsPageProps {
    projects: Project[]
    user: User
}

type FormData = z.infer<typeof projectInputSchema>;

const projectTypes = [
    {
        title: "Video to Text",
        type: "video",
        icon: <div className={`size-20 rounded-lg bg-yellow-400 flex items-center justify-center`} >
            <Video size={35}></Video>
        </div>,
        bgColor: "yellow"
    },
    {
        title: "Image to Text",
        type: "image",
        icon: <div className={`size-20 rounded-lg bg-blue-400 flex items-center justify-center`} >
            <Image size={35}></Image>
        </div>,
        bgColor: "blue"
    },
    {
        title: "Audio to Text",
        type: "audio",
        icon: <div className={`size-20 rounded-lg bg-fuchsia-400 flex items-center justify-center`} >
            <FileMusic size={35}></FileMusic>
        </div>,
        bgColor: "fuchsia"
    }];

const ProjectsPage: FC<ProjectsPageProps> = ({ projects, user }) => {
    const router = useRouter();
    const [modal, setModal] = useState(false)
    const [selectedType, setSelectedType] = useState('');
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(projectInputSchema),
    });



    const onSubmit = async (data: FormData) => {
        try {
            if (selectedType !== "") {
                const res = axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/project/create`, {
                    name: data.name,
                    type: selectedType,
                    tags: tags
                }, {
                    withCredentials: true,
                })
                if ((await res).status === 201) {
                    router.refresh();
                    toast.success("New Project Created Successfully!")
                }
            }
            else {
                toast.error("Please Fill All The Input Fields!")
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError("name", { message: error.message });
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
            setSelectedType('');
            setModal(false);
        }
    }

    return (
        <main>
            {
                projects.length > 0 ?
                    <main className='px-16'>
                        <div className='flex items-center justify-between w-full mx-auto '>
                            <input type="text" className='bg-[#2C2C2C] px-4 py-1 w-[30rem] text-white rounded-md focus:border-none focus:ring-2 focus:ring-bigRed' placeholder='Search Projects' />
                            <div className='flex gap-3'>
                                {/* BNB Code */}
                                <IconBtn onClick={() => router.push('/label-data/settings/billing')} icon={<HandCoins />} title={`${user.credits} Credits`} />
                                <IconBtn onClick={() => setModal(true)} icon={<Plus />} title='New Project' />
                            </div>
                        </div>
                        <div className='pt-5 pb-10 w-full flex gap-5 flex-wrap'>
                            {
                                projects.map((project) => (
                                    <ProjectCard project={project} key={project._id} />
                                ))
                            }
                        </div>
                    </main> :
                    <main className='w-[45%] mx-auto'>
                        <NextImage src='/label/no-project.png' alt='no project' width={500} height={500} className='mx-auto mt-10' />
                        <p className='text-white font-normal text-center text-xl mt-2'>There are no projects in this workspace.</p>
                        <p className='text-white font-light text-center text-base mt-4'>Create a project and upload images to start labelling, training, and deploying your computer vision model</p>
                        <IconBtn onClick={() => setModal(true)} icon={<Plus />} title='New Project' className='mx-auto mt-2' />
                    </main>
            }
            <Dialog open={modal} onOpenChange={(open) => setModal(open)} >
                <DialogContent className='w-[900px] p-10 font-albert-sans'>
                    <DialogHeader>
                        <DialogTitle className='text-bigRed font-medium text-2xl'>Create a Project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col justify-center'>
                        <div className='w-full flex items-start gap-6'>
                            <div className='flex-1 flex flex-col'>
                                {/* <label htmlFor="project-name">Project Name</label> */}
                                <InputAkai title='Project Name' htmlFor='project-name' error={errors.name?.message} {...register("name")} className='' inputType="text" />
                                {/* <p className="text-sm text-red-700">{errors.name?.message}</p> */}
                            </div>
                            <div className='flex-1'>
                                <div className=''>
                                    <InputAkai htmlFor='project-tags' title='Tags' value={tagInput} onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (tagInput.trim() !== '') {
                                                setTags((prev) => [...prev, tagInput.trim()]);
                                                setTagInput('')
                                            }
                                        }
                                    }} onChange={(e) => setTagInput(e.target.value)} inputType="text" placeholder='Enter Project Tags' />
                                </div>
                                <div className='flex flex-wrap items-center gap-2 pt-2'>
                                    {
                                        tags.map((tag, i) => (
                                            <div className='bg-red-900 text-white px-2 py-1 rounded-lg flex items-center justify-between gap-1' key={i}>
                                                {tag}
                                                <span className='mt-1 cursor-pointer' onClick={() => setTags((prev) => prev.filter((t) => t !== tag))} >
                                                    <X size={18}></X>
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <label className=' mt-4 mb-2'>Select the Project Type</label>
                        <div className='grid grid-cols-2 gap-4'>
                            {
                                projectTypes.map((projectType) => (
                                    <ProjectType bgColor={projectType.bgColor} Icon={projectType.icon} title={projectType.title} key={projectType.type} onClick={() => setSelectedType(projectType.type)} isSelected={selectedType === projectType.type} />
                                ))
                            }
                        </div>
                        <Button disabled={isSubmitting} type='submit' variant='akai' className='mt-5'>
                            {isSubmitting ?
                                <>
                                    <span className='animate-spin'><Loader fill='white' /></span>
                                    Creating Project
                                </> : "Create Project"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    )
}

export default ProjectsPage