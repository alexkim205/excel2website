import {Layouts, Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "./Grid.css"
import {ReactNode, useMemo} from "react";

export function Grid({children, layouts}: {children: ReactNode, layouts: Layouts}) {
    const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

    return (
        <ResponsiveGridLayout
            layouts={layouts}
            rowHeight={100}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            className="max-w-[1024px] w-full"
            draggableHandle=".custom-draggable-handle"
        >
            {children}
        </ResponsiveGridLayout>
    )
}