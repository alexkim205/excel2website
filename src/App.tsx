import {Nav} from "./components/Nav";
import {useValues} from "kea";
import {dataLayerLogic} from "./logics/dataLayerLogic";
import {Chart} from "./components/Chart";

function App() {
    const {charts} = useValues(dataLayerLogic)

  return (
      <div className="flex flex-col min-h-screen items-center gap-12">
          <Nav/>
          <div className="grid md:grid-cols-3 grid-cols-1 max-w-[1024px] gap-8 px-6 w-full">
              {charts.map((chart) => <Chart key={chart.id} chart={chart}/>)}
          </div>
      </div>
  )
}

export default App
