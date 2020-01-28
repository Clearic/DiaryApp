import { Action, Request, 
    LOAD_NOTES_SUCCESS, CREATE_NOTE_SUCCESS, UPDATE_NOTE_SUCCESS, DELETE_NOTE_SUCCESS,
    LOAD_NOTES_REQUEST, CREATE_NOTE_REQUEST, UPDATE_NOTE_REQUEST, DELETE_NOTE_REQUEST } from "../actions";
import { Reducer } from "redux";

export const requestsReducer: Reducer<ReadonlyArray<Request>> =
    (state: ReadonlyArray<Request> = [], action: Action) => {

    switch (action.type) {
        case LOAD_NOTES_REQUEST:
        case CREATE_NOTE_REQUEST:
        case UPDATE_NOTE_REQUEST:
        case DELETE_NOTE_REQUEST:
            return [...state, action];
        case LOAD_NOTES_SUCCESS:
        case CREATE_NOTE_SUCCESS:
        case UPDATE_NOTE_SUCCESS:
        case DELETE_NOTE_SUCCESS:
            return state.filter(x => !(x.reqID === action.reqID));
    }
    return state;
};
