import { applyMiddleware, createStore } from "redux";
import { RootReducer } from "./rootReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";


export const store = createStore(
    RootReducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)
export type RootState = ReturnType<typeof RootReducer>
export type AppDispatch = typeof store.dispatch