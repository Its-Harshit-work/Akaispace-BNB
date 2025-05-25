import AuthLayout from '@/components/Auth/AuthLayout';
import RegForm from '@/components/Auth/RegForm'
import Image from 'next/image';
import { FC } from 'react'

interface pageProps {

}
export const metadata = {
  title: 'Register at Akai Space',
  description: 'Register Page of Akai Space',
};

const page: FC<pageProps> = ({ }) => {
  return (
    <AuthLayout>
      <RegForm />
    </AuthLayout>
  )
}

export default page