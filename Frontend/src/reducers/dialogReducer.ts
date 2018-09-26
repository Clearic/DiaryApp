import { Dialog, NoDialog, CreateNoteDialog, EditNoteDialog } from "../store";
import { Action } from "../actions";
import { Reducer } from "redux";
import { getCurrentDateTime } from "../date";

const init: NoDialog = {type: "NoDialog"};

export const dialogReducer: Reducer<Dialog> = (state: Dialog = init, action: Action) => {
    switch (action.type) {
        case "NewNote":
            const date = action.date || getCurrentDateTime();
            return {
                type: "CreateNoteDialog",
                date
            } as CreateNoteDialog;
        case "OpenNote":
            return {
                type: "EditNoteDialog",
                note: action.note
            } as EditNoteDialog;
        case "CloseDialog":
            return {
                type: "NoDialog"
            } as NoDialog;
    }
    return state;
};
