import { FC } from 'react'

interface InputAkaiProps extends React.InputHTMLAttributes<HTMLInputElement> {
    title: string
    htmlFor: string
    inputType?: string
    className?: string
    error?: string
}

const InputAkai: FC<InputAkaiProps> = ({ htmlFor, title, inputType = 'text', className, error, ...props }) => {
    return (
        <div className={`flex-1 flex flex-col ${className}`}>
            <label htmlFor={htmlFor}>{title}</label>
            <input className=' bg-inputBg rounded-md px-4 py-2 mt-1 focus:border-transparent ring-transparent ring-4 focus:ring-bigRed text-black' type={inputType} placeholder={`Enter ${title}`} {...props} />
            {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
        </div>
    )
}

export default InputAkai