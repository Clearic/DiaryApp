import { Dialog, NoDialog, CreateNoteDialog, EditNoteDialog } from "../types";
import { Action, NEW_NOTE, OPEN_NOTE, CLOSE_DIALOG } from "../actions";
import { Reducer } from "redux";
import { getCurrentDateTime } from "../date-time";

const init: NoDialog = { type: "NoDialog" };

export const dialogReducer: Reducer<Dialog> = (state: Dialog = init, action: Action) => {
    switch (action.type) {
        case NEW_NOTE:
            const date = action.date || getCurrentDateTime();
            return {
                type: "CreateNoteDialog",
                date
            } as CreateNoteDialog;
        case OPEN_NOTE:
            return {
                type: "EditNoteDialog",
                note: action.note
            } as EditNoteDialog;
        case CLOSE_DIALOG:
            return {
                type: "NoDialog"
            } as NoDialog;
    }
    return state;
};
