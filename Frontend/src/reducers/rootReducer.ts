import { Reducer, combineReducers } from "redux";
import { ApplicationState } from "../store";
import { Action } from "../actions";
import { notesReducer } from "./notesReducer";
import { dialogReducer } from "./dialogReducer";
import { requestsReducer } from "./requestsReducer";

const scrollToCurrentMonthReducer: Reducer<number, Action> = (state: number = 0, action: Action) => {
    switch (action.type) {
        case "ScrollToCurrentWeek":
            return new Date().getTime();
    }
    return state;
};

export const rootReducer = combineReducers({
    scrollToCurrentMonth: scrollToCurrentMonthReducer,
    notes: notesReducer,
    dialog: dialogReducer,
    requests: requestsReducer
});
