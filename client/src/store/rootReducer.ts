import { combineReducers } from "redux";
import { AuthReducer } from "./reducers/authReducer";

export const RootReducer = combineReducers({
    auth: AuthReducer
})