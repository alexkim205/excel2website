import {Nav} from "./components/Nav";
import {useValues} from "kea";
import {dataLayerLogic} from "./logics/dataLayerLogic";
import {DashboardItem} from "./components/DashboardItem";
import {Grid} from "./components/Grid/Grid";

function App() {
    const {charts, layouts} = useValues(dataLayerLogic)

    return (
        <div className="flex flex-col min-h-screen items-center gap-12">
            <Nav/>
            <Grid layouts={layouts}>
                {charts.map((chart) => <div key={chart.id}>
                    <DashboardItem key={chart.id} chart={chart}/>
                </div>)}
            </Grid>
        </div>
    )
}

export default App
