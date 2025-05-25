import { FC, } from 'react'
import CustomBtn from '../ui/CustomBtn';
import Link from 'next/link';
import Image from 'next/image';

interface RegFormProps {

}

const RegForm: FC<RegFormProps> = ({ }) => {

    return (
        <div className='w-full flex flex-col items-center'>
            <div className='flex flex-col px-10 gap-6 items-center justify-center p-6 w-[25rem] border border-black
    bg-white shadow-[3px_3px_0px_0px_rgba(204,11,33,1)] font-albert-sans relative z-10'>
                <p className='text-prime font-semibold   text-3xl' >Register</p>
                <p className='    text-lg' >You are registering for</p>
                <Link href="/auth/register/user">
                    <CustomBtn variant="big" >
                        Individual
                    </CustomBtn>
                </Link>
                <Link href="/auth/register/enterprise">
                    <CustomBtn variant="big" >
                        Company
                    </CustomBtn>
                </Link>
                <div className='flex items-center gap-2   '>
                    <p>Already have an account?</p>
                    <Link href='/auth/login' className='text-blue-500 hover:underline hover:opacity-85'>
                        <span>Login</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default RegForm