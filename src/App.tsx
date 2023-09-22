import {Nav} from "./components/Nav";
import {useValues} from "kea";
import {sceneLogic} from "./logics/sceneLogic";
import {SceneKey} from "./utils/routes";
import {Home} from "./scenes/Home";
import {Dashboard} from "./scenes/Dashboard";

function App() {
    const {scene, params} = useValues(sceneLogic)

    return (
        <div className="flex flex-col min-h-screen items-center gap-12">
            <Nav/>
            {{
                [SceneKey.Home]: <Home/>,
                [SceneKey.Dashboard]: <Dashboard props={{id: params.id}}/>
            }[scene]}

        </div>
    )
}

export default App
