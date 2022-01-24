import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";
import {AuthRegisterAction, AuthLoginAction} from "../store/async_actions/authAction";

export const useAction = () => {
    const dispatch = useDispatch()
    return bindActionCreators({
        AuthRegisterAction,
        AuthLoginAction
    }, dispatch)
}
const {} = useAction()