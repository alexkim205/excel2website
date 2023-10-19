import {Nav} from "./components/Nav";
import {useMountedLogic, useValues} from "kea";
import {sceneLogic} from "./logics/sceneLogic";
import {SceneKey} from "./utils/routes";
import {dashboardGridLogic} from "./logics/dashboardGridLogic";
import {lazy, Suspense} from "react";
import clsx from "clsx";
import {DemoAnnouncement, LifetimeDealAnnouncment} from "./components/Announcement";


const ROUTES: Record<SceneKey, any> = {
    [SceneKey.Home]: lazy(() => import('./scenes/Home')),
    [SceneKey.Dashboards]: lazy(() => import('./scenes/Dashboards')),
    [SceneKey.Dashboard]: lazy(() => import('./scenes/Dashboard')),
    [SceneKey.DemoDashboard]: lazy(() => import("./components/Demo/DemoDashboard")),
    [SceneKey.PublicDashboard]: lazy(() => import('./scenes/PublicDashboard')),
    [SceneKey.Admin]: lazy(() => import('./scenes/AdminDashboard')),
    [SceneKey.Pricing]: lazy(() => import('./scenes/Pricing')),
    [SceneKey.Trust]: lazy(() => import("./scenes/Trust")),
    [SceneKey.SignIn]: lazy(() => import('./scenes/Auth/SignIn')),
    [SceneKey.SignUp]: lazy(() => import('./scenes/Auth/SignUp')),
    [SceneKey.ForgotPassword]: lazy(() => import('./scenes/Auth/ForgotPassword')),
    [SceneKey.ResetPassword]: lazy(() => import('./scenes/Auth/ResetPassword')),
}

function App() {
    useMountedLogic(dashboardGridLogic)
    const {scene, params, domain} = useValues(sceneLogic)

    if (domain) {
        const Scene = ROUTES[SceneKey.PublicDashboard]
        return <Scene subdomain={domain}/>
    }

    const Scene = ROUTES[scene as SceneKey]
    const isAuthPage = [SceneKey.SignIn, SceneKey.SignUp, SceneKey.ForgotPassword, SceneKey.ResetPassword].includes(scene)
    const isDemoDashboardPage = scene === SceneKey.DemoDashboard

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div className={clsx("flex flex-col items-center overflow-hidden")}>
            <>
                {isDemoDashboardPage ? <DemoAnnouncement/> : !isAuthPage && (<LifetimeDealAnnouncment/>)}
                <Nav key={scene}/>
                <Suspense fallback={<></>}>
                    <Scene {...(scene === SceneKey.Dashboard ? {id: params.id} : {})}/>
                </Suspense>
            </>
        </div>
    )
}

export default App
