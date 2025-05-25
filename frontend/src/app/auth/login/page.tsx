import AuthLayout from '@/components/Auth/AuthLayout'
import LoginForm from '@/components/Auth/LoginForm'
import Image from 'next/image'
import { FC } from 'react'

interface pageProps {

}

const page: FC<pageProps> = ({ }) => {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    )
}

export default page