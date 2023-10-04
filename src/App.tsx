import {Nav} from "./components/Nav";
import {useMountedLogic, useValues} from "kea";
import {sceneLogic} from "./logics/sceneLogic";
import {SceneKey} from "./utils/routes";
import {dashboardGridLogic} from "./logics/dashboardGridLogic";
import {lazy, Suspense} from "react";
import {Spinner} from "@nextui-org/react";


const ROUTES: Record<SceneKey, any> = {
    [SceneKey.Home]: lazy(() => import('./scenes/Home')),
    [SceneKey.Dashboards]: lazy(() => import('./scenes/Dashboards')),
    [SceneKey.Dashboard]: lazy(() => import('./scenes/Dashboard')),
    [SceneKey.PublicDashboard]: lazy(() => import('./scenes/PublicDashboard')),
    [SceneKey.Admin]: lazy(() => import('./scenes/AdminDashboard')),
    [SceneKey.Pricing]: lazy(() => import('./scenes/Pricing')),
}

function App() {
    useMountedLogic(dashboardGridLogic)
    const {scene, params, domain} = useValues(sceneLogic)

    if (domain) {
        const Scene = ROUTES[SceneKey.PublicDashboard]
        return <Scene subdomain={domain}/>
    }

    const Scene = ROUTES[scene as SceneKey]

    return (
        <div className="flex flex-col min-h-screen items-center gap-12 overflow-hidden">
            <>
                <Nav/>
                <Suspense fallback={<Spinner />}>
                    <Scene {...(scene === SceneKey.Dashboard ? {id: params.id} : {})}/>
                </Suspense>
            </>
        </div>
    )
}

export default App
