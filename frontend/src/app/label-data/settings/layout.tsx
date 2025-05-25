
import SettingsSidebar from '@/components/LabelData/Settings/SettingsSidebar'
import { FC, ReactNode } from 'react'

interface layoutProps {
  children: ReactNode
}

export const metadata = {
  title: "Settings - Akai Space",
  description: "Settings page of Akai Space"
}
const layout: FC<layoutProps> = ({ children }) => {
  return (
    <div className='w-full min-h-screen bg-darkBg flex'>
      <SettingsSidebar />
      <div className='min-h-screen flex-1 bg-darkBg'>
        {children}
      </div>
    </div>
  )
}

export default layout