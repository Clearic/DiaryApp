import { Action, Request } from "../actions";
import { Reducer } from "redux";

export const requestsReducer: Reducer<ReadonlyArray<Request>> =
    (state: ReadonlyArray<Request> = [], action: Action) => {

    switch (action.type) {
        case "LoadNotesRequest":
        case "CreateNoteRequest":
        case "UpdateNoteRequest":
        case "DeleteNoteRequest":
            return [...state, action];
        case "LoadNotesSuccess":
        case "CreateNoteSuccess":
        case "UpdateNoteSuccess":
        case "DeleteNoteSuccess":
            return state.filter(x => !(x.reqID === action.reqID));
    }
    return state;
};
