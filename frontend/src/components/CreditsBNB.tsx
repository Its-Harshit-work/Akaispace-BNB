'use client'
import { FC, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Info } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import InputAkai from './ui/InputAkai'
import { Button } from './ui/button'

interface CreditsBNBProps {

}

const CreditsBNB: FC<CreditsBNBProps> = ({ }) => {
    const [credits, setcredits] = useState('')
    const [modal, setmodal] = useState(false)
    console.log(credits);
    return (
        <div className='font-albert-sans text-white py-2 pl-6 pr-40'>
            {/* <p className='mb-4'>
                    Manage your plan settings
                </p> */}
            <div className='border-2 rounded-md px-6 py-3 border-[#3C3C3C] '>
                <div className="flex gap-4 items-center mb-2">
                    <h1 className='font-bold text-lg '>Add Credits</h1>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span><Info /></span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>1 Credit is of 0.000074 BNB</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* <div className='flex items-center gap-2'>
                        <Users className='' />
                        <p className='font-semibold text-xl'>Public Plan</p>
                    </div>
                    <p>best for personal , open source, and research projects, with public datasets and models for the community to use.</p>
                    <p className='font-semibold text-lg mt-6'>What&apos;s Included</p>
                    <div className='grid grid-cols-2 gap-4 items-center mt-3'>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className='flex items-center gap-3'>
                                <CircleDollarSign className='text-bigRed size-5' />
                                <div >
                                    <span className='mr-1 font-bold'>15 Credits</span>
                                    <span>per month</span>
                                </div>
                            </div>
                        ))}
                    </div> */}
                <div className='w-full mb-3 flex gap-4'>
                    <button className='font-semibold hover:opacity-95 active:scale-95 flex-1 px-4 py-2 bg-gradient-to-b from-rose-900 to bg-red-700 rounded-lg  '>
                        100 Credits
                    </button>
                    <button className='font-semibold hover:opacity-95 active:scale-95 flex-1 px-4 py-2 bg-gradient-to-b from-rose-900 to bg-red-700 rounded-lg  '>
                        1000 Credits
                    </button>
                </div>
                <div className='w-full flex gap-4'>
                    <button className='font-semibold hover:opacity-95 active:scale-95  flex-1 px-4 py-2 bg-gradient-to-b from-rose-900 to bg-red-700 rounded-lg  '>
                        10000 Credits
                    </button>
                    <button onClick={() => setmodal(true)} className='font-semibold hover:opacity-95 active:scale-95  flex-1 px-4 py-2 bg-gradient-to-b from-rose-900 to bg-red-700 rounded-lg  '>
                        Custom
                    </button>
                </div>
            </div>
            <Dialog open={modal} onOpenChange={setmodal} >
                <DialogContent className='max-w-xl'>
                    <DialogHeader>
                        <DialogTitle>
                            Add Credits
                        </DialogTitle>
                        <DialogDescription>
                            Enter amount of credits you want to purchase
                        </DialogDescription>
                    </DialogHeader>
                    <InputAkai min={1} type='number' value={credits} onChange={(e) => setcredits(e.target.value)} title='Credits' htmlFor='credits' />
                    <Button variant='akai' >Purchase</Button>
                </DialogContent>
            </Dialog>
            {/* <div className='bg-[#303030] flex items-center justify-between p-4 rounded-md my-4'>
                    <div className='flex  items-center gap-2'>
                        <Star fill='white' />
                        <div>
                            <p className='font-bold text-xl'>Upgrade To Paid Plan</p>
                            <p className='text-sm'>Enjoy access to key features and benefits, with a plan tailored for startup and small buisinesses.</p>
                        </div>
                    </div>
                    <IconBtn icon={<BriefcaseBusiness />} className='text-sm' title='View Plans' />
                </div>
                <div className='border-2 border-[#3C3C3C] flex items-center justify-between p-4 rounded-md my-4'>
                    <div className='flex gap-2'>
                        <CreditCard className='mt-1' />
                        <div>
                            <p className='font-bold text-xl'>Billing Portal</p>
                            <p className='text-sm'>Manage payment methods & view previous invoices.</p>
                        </div>
                    </div>
                    <button className=' py-2 px-6 text-sm rounded-lg border border-white'>Learn More</button>
                </div> */}
        </div>
    )
}

export default CreditsBNB