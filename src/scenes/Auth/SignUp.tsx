import {SceneKey} from "../../utils/routes";
import {AuthSwitchComponent} from "./auth.shared";

function SignUp() {
    return (
        <AuthSwitchComponent scene={SceneKey.SignUp}/>
    )
}

export default SignUp