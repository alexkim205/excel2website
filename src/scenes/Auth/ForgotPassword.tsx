import {SceneKey} from "../../utils/routes";
import {AuthSwitchComponent} from "./auth.shared";

function ForgotPassword() {
    return (
        <AuthSwitchComponent scene={SceneKey.ForgotPassword}/>
    )
}

export default ForgotPassword