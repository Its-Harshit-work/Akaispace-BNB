import RegisterForm from '@/components/Auth/RegisterForm';
import { FC } from 'react'
import Image from 'next/image'
import AuthLayout from '@/components/Auth/AuthLayout';

interface pageProps {
    params: Promise<{ role: string }>
}

const page: FC<pageProps> = async ({ params }) => {
    const role = await (await params).role;
    return (
        <AuthLayout>
            <RegisterForm role={role} />
        </AuthLayout>
    )
}

export default page