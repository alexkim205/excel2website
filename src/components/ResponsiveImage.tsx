import {forwardRef} from "react";

export const ResponsiveImage = forwardRef<HTMLImageElement, {
    srcSet: { src: string, w: number }[],
    alt: string,
}>(({srcSet, alt}, ref) => {
    return (
        <img
            ref={ref}
            src={`${srcSet.slice(0)?.[0].src}`}
            srcSet={srcSet.map(({src, w}) => `${src} ${w}w`).join(", ")}
            sizes={`${srcSet.slice(0, srcSet.length - 1).map(({w}) => `(max-width: ${w}px) ${w}px`).join(", ")}, ${srcSet.slice(-1)?.[0]?.w}px`}
            alt={alt}
        />
    )
})