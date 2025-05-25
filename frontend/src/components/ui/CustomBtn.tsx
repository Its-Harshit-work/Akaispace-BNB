import { ButtonHTMLAttributes, FC } from 'react'
import { VariantProps, cva } from "class-variance-authority";
import { cn } from '@/lib/utils';

const btnVariants = cva(
    "text-center font-helvetica-medium bg-inputBg text-black",
    {
        variants: {
            variant: {
                big: "bg-inputBg text-lg w-full px-20 py-2 active:bg-white border border-black active:scale-90 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[3px_3px_0px_0px_rgba(204,11,33,1)]",
                small: "bg-inputBg rounded-2xl text-xs py-2 px-10",
                smallActive: "bg-white rounded-2xl border border-black text-xs py-2 px-10 shadow-[2px_2px_0px_0px_rgba(204,11,33,1)]"
            }
        },
    }
)

interface CustomBtnProps extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof btnVariants> {

}

const CustomBtn: FC<CustomBtnProps> = ({ className, children, variant, ...props }) => {
    return (
        <button className={cn(btnVariants({ variant, className }))} {...props} >
            {children}
        </button>
    )
}

export default CustomBtn