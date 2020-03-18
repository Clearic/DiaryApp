import { Note, YearMonth, DateTime, ApplicationState } from "./types";
import * as Actions from "./actions";
import * as api from "./api";

export type ThunkAction = (
    dispatch: (action: Actions.Action) => Actions.Action,
    getState: () => ApplicationState
) => void;

let lastRequestID = 0;

function getNewRequestID() {
    return ++lastRequestID;
}

export const loadNotes = (month: YearMonth): ThunkAction => {
    return (dispatch) => {
        const reqID = getNewRequestID();
        dispatch(Actions.loadNotesRequest(reqID, month));

        api.getNotes(month).then(notes => {
            dispatch(Actions.loadNotesSuccess(reqID, month, notes));
        });
    }
}

export const createNote = (date: DateTime, text: string): ThunkAction => {
    return dispatch => {
        const reqID = getNewRequestID();
        dispatch(Actions.createNoteRequest(reqID, date, text));

        api.createNote(date, text).then(x => {
            const note: Note = {
                id: x.id,
                date, text
            }
            dispatch(Actions.createNoteSuccess(reqID, note));
        });
    }
}

export const updateNote = (note: Note, oldDate: DateTime): ThunkAction => {
    return dispatch => {
        const reqID = getNewRequestID();
        dispatch(Actions.updateNoteRequest(reqID, note, oldDate));

        api.updateNote(note).then(x => {
            dispatch(Actions.updateNoteSuccess(reqID, note, oldDate));
        });
    }
}

export const deleteNote = (note: Note): ThunkAction => {
    return dispatch => {
        const reqID = getNewRequestID();
        dispatch(Actions.deleteNoteRequest(reqID, note));

        api.deleteNote(note).then(x => {
            dispatch(Actions.deleteNoteSuccess(reqID, note));
        });
    }
}
