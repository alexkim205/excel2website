import {Nav} from "./components/Nav";
import {useMountedLogic, useValues} from "kea";
import {sceneLogic} from "./logics/sceneLogic";
import {SceneKey} from "./utils/routes";
import {Home} from "./scenes/Home";
import {Dashboard} from "./scenes/Dashboard";
import {homeLogic} from "./logics/homeLogic";
import {lazy} from "react";

const PublicDashboard = lazy(() => import('./scenes/PublicDashboard'))

function App() {
    useMountedLogic(homeLogic)
    const {scene, params, subdomain} = useValues(sceneLogic)

    console.log("SUBDOMAIN", scene, params, subdomain)
    if (subdomain) {
        return <PublicDashboard subdomain={subdomain}/>
    }

    return (
        <div className="flex flex-col min-h-screen items-center gap-8">
            <Nav/>
            {{
                [SceneKey.Home]: <Home/>,
                [SceneKey.Dashboard]: <Dashboard props={{id: params.id}}/>,
            }[scene as SceneKey.Home | SceneKey.Dashboard]}

        </div>
    )
}

export default App
