import {Layouts, Responsive, ResponsiveProps, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "./Grid.css"
import {ReactNode, useMemo} from "react";

export function Grid({children, layouts, onLayoutChange, ...props}: {children: ReactNode, layouts: Layouts, onLayoutChange?: (layouts: Layouts) => void} & Omit<ResponsiveProps, "layouts" | "onLayoutChange">) {
    const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

    return (
        <ResponsiveGridLayout
            layouts={layouts}
            onLayoutChange={(_, allLayouts) => onLayoutChange?.(allLayouts)}
            rowHeight={100}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            className="w-full max-w-[1600px] mx-auto"
            draggableHandle=".custom-draggable-handle"
            draggableCancel=".custom-draggable-cancel"
            {...props}
        >
            {children}
        </ResponsiveGridLayout>
    )
}