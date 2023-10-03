import {Nav} from "./components/Nav";
import {useMountedLogic, useValues} from "kea";
import {sceneLogic} from "./logics/sceneLogic";
import {SceneKey} from "./utils/routes";
import {Home} from "./scenes/Home";
import {Dashboard} from "./scenes/Dashboard";
import {dashboardGridLogic} from "./logics/dashboardGridLogic";
import {lazy} from "react";
import {AdminDashboard} from "./scenes/AdminDashboard";
import {Pricing} from "./scenes/Pricing";
import {Dashboards} from "./scenes/Dashboards";

const PublicDashboard = lazy(() => import('./scenes/PublicDashboard'))

function App() {
    useMountedLogic(dashboardGridLogic)
    const {scene, params, domain} = useValues(sceneLogic)

    if (domain) {
        return <PublicDashboard subdomain={domain}/>
    }

    return (
        <div className="flex flex-col min-h-screen items-center gap-12 overflow-hidden">
            <Nav/>
            {{
                [SceneKey.Home]: <Home/>,
                [SceneKey.Dashboards]: <Dashboards/>,
                [SceneKey.Dashboard]: <Dashboard props={{id: params.id}}/>,
                [SceneKey.Admin]: <AdminDashboard/>,
                [SceneKey.Pricing]: <Pricing/>,
            }[scene as SceneKey.Home | SceneKey.Dashboard]}

        </div>
    )
}

export default App
