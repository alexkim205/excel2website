import {ReactNode} from "react";

interface SectionProps {
    title: ReactNode,
    subtitle?: ReactNode,
    children: ReactNode
}

export function Section({title, subtitle, children}: SectionProps) {
    return (
        <div className="flex flex-col gap-8 sm:gap-12 mt-10 sm:mt-14 mb-10">
            <div className="flex flex-col gap-3 items-center">
                <h2 className="text-center font-bold sm:text-4xl text-3xl !leading-[2.5rem] sm:!leading-[3rem]">{title}</h2>
                {subtitle && <p className="text-center max-w-xl">{subtitle}</p>}
            </div>
            {children}
        </div>
    )
}