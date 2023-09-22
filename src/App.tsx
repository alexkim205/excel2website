import {Nav} from "./components/Nav";
import {useMountedLogic, useValues} from "kea";
import {sceneLogic} from "./logics/sceneLogic";
import {SceneKey} from "./utils/routes";
import {Home} from "./scenes/Home";
import {Dashboard} from "./scenes/Dashboard";
import {homeLogic} from "./logics/homeLogic";

function App() {
    useMountedLogic(homeLogic)
    const {scene, params} = useValues(sceneLogic)

    return (
        <div className="flex flex-col min-h-screen items-center gap-8">
            <Nav/>
            {{
                [SceneKey.Home]: <Home/>,
                [SceneKey.Dashboard]: <Dashboard props={{id: params.id}}/>
            }[scene]}

        </div>
    )
}

export default App
