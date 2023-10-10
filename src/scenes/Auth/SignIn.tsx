import {SceneKey} from "../../utils/routes";
import {AuthSwitchComponent} from "./auth.shared";

function SignIn() {
    return (
        <AuthSwitchComponent scene={SceneKey.SignIn}/>
    )
}

export default SignIn