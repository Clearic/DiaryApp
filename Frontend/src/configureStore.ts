import * as Redux from "redux";
import { rootReducer } from "./reducers/rootReducer";
import thunk  from "redux-thunk";

export function configureStore() {
    const middlewares = [];

    middlewares.push(thunk);

    const store = Redux.createStore(
        rootReducer,
        Redux.applyMiddleware(...middlewares)
    );

    return store;
}
