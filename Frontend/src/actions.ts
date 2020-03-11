import { Note, Month, DateTime } from "./types";

export const NEW_NOTE = "NewNote";

export interface NewNote {
    type: typeof NEW_NOTE;
    date?: DateTime;
}

export function newNote(date?: DateTime): NewNote {
    return {
        type: NEW_NOTE,
        date
    } as const;
}

export const OPEN_NOTE = "OpenNote";

export function openNote(note: Note) {
    return {
        type: OPEN_NOTE,
        note
    } as const;
}

export const CLOSE_DIALOG = "CloseDialog";

export function closeDialog() {
    return {
        type: CLOSE_DIALOG
    } as const;
}

export const SCROLL_TO_CURRENT_WEEK = "ScrollToCurrentWeek";

export function scrollToCurrentWeek() {
    return {
        type: SCROLL_TO_CURRENT_WEEK
    } as const;
}

// Requests

export const LOAD_NOTES_REQUEST = "LoadNotesRequest";

export function loadNotesRequest(reqID: number, month: Month) {
    return {
        type: LOAD_NOTES_REQUEST,
        reqID, month
    } as const;
}

export const LOAD_NOTES_SUCCESS = "LoadNotesSuccess";

export function loadNotesSuccess(reqID: number, month: Month, notes: Note[]) {
    return {
        type: LOAD_NOTES_SUCCESS,
        reqID, month, notes
    } as const;
}

export const CREATE_NOTE_REQUEST = "CreateNoteRequest";

export function createNoteRequest(reqID: number, date: DateTime, text: string) {
    return {
        type: CREATE_NOTE_REQUEST,
        reqID, date, text
    } as const;
}

export const CREATE_NOTE_SUCCESS = "CreateNoteSuccess";

export function createNoteSuccess(reqID: number, note: Note) {
    return {
        type: CREATE_NOTE_SUCCESS,
        reqID, note
    } as const;
}

export const UPDATE_NOTE_REQUEST = "UpdateNoteRequest";

export function updateNoteRequest(reqID: number, note: Note, oldDate: DateTime) {
    return {
        type: UPDATE_NOTE_REQUEST,
        reqID, note, oldDate
    } as const;
}

export const UPDATE_NOTE_SUCCESS = "UpdateNoteSuccess";

export function updateNoteSuccess(reqID: number, note: Note, oldDate: DateTime) {
    return {
        type: UPDATE_NOTE_SUCCESS,
        reqID, note, oldDate
    } as const;
}

export const DELETE_NOTE_REQUEST = "DeleteNoteRequest";

export function deleteNoteRequest(reqID: number, note: Note) {
    return {
        type: DELETE_NOTE_REQUEST,
        reqID, note
    } as const;
}

export const DELETE_NOTE_SUCCESS = "DeleteNoteSuccess";

export function deleteNoteSuccess(reqID: number, note: Note) {
    return {
        type: DELETE_NOTE_SUCCESS,
        reqID, note
    } as const;
}

export type Action =
    ReturnType<typeof newNote> |
    ReturnType<typeof openNote> |
    ReturnType<typeof closeDialog> |
    ReturnType<typeof scrollToCurrentWeek> |
    Request;

export type Request =
    ReturnType<typeof loadNotesRequest> |
    ReturnType<typeof loadNotesSuccess> |
    ReturnType<typeof createNoteRequest> |
    ReturnType<typeof createNoteSuccess> |
    ReturnType<typeof updateNoteRequest> |
    ReturnType<typeof updateNoteSuccess> |
    ReturnType<typeof deleteNoteRequest> |
    ReturnType<typeof deleteNoteSuccess>;
