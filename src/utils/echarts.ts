import * as _echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
} from 'echarts/components';
import {CanvasRenderer} from "echarts/renderers";
import { LabelLayout, UniversalTransition } from 'echarts/features';

_echarts.use([
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

export default _echarts