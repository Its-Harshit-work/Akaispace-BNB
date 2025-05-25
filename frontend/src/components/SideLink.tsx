import Link from 'next/link'
import { FC, ReactNode } from 'react'
import clsx from 'clsx'

interface SideLinkProps {
    icon: ReactNode
    title: string
    link: string
    active?: boolean
    className?: string
    linkClassName?: string
    hrClassName?: string
}

const SideLink: FC<SideLinkProps> = ({ link, active, icon, title, className, hrClassName, linkClassName }) => {
    return (
        <div className={` font-albert-sans ${className}`}>
            <Link href={link} className={`relative group flex items-center justify-start ${linkClassName}`}>
                <div className={`${active ? 'text-bigRed' : 'text-black group-hover:text-bigRed transition-all duration-300'}`}>{icon}</div>
                <p className={`${active ? 'text-bigRed font-medium' : 'text-black group-hover:text-bigRed transition-all duration-300'}`} >{title}</p>
                <span className={clsx('absolute -bottom-2 left-0 h-px bg-bigRed group-hover:w-full transition-all duration-300', active ? 'w-full' : 'w-0')}></span>
            </Link>
        </div>

    )
}

export default SideLink