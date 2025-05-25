import AuthLayout from '@/components/Auth/AuthLayout'
import OTPForm from '@/components/Auth/OTPForm'
import Image from 'next/image'
import { FC, Suspense } from 'react'

interface pageProps {

}

const page: FC<pageProps> = ({ }) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthLayout>
                <OTPForm />
            </AuthLayout>
        </Suspense>
    )
}

export default page