import {SceneKey} from "../../utils/routes";
import {AuthSwitchComponent} from "./auth.shared";

function ResetPassword() {
    return (
        <AuthSwitchComponent scene={SceneKey.ResetPassword}/>
    )
}

export default ResetPassword