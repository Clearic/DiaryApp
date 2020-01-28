import { Note, Month, DateTime } from "./store";

export const NEW_NOTE = "NewNote";

export interface NewNote {
    type: typeof NEW_NOTE;
    date?: DateTime;
}

export function newNote(date?: DateTime): NewNote {
    return {
        type: NEW_NOTE,
        date
    };
}

export const OPEN_NOTE = "OpenNote";

export interface OpenNote {
    type: typeof OPEN_NOTE;
    note: Note;
}

export function openNote(note: Note): OpenNote {
    return {
        type: OPEN_NOTE,
        note
    };
}

export const CLOSE_DIALOG = "CloseDialog";

export interface CloseDialog {
    type: typeof CLOSE_DIALOG;
}

export function closeDialog(): CloseDialog {
    return {
        type: CLOSE_DIALOG
    };
}

export const SCROLL_TO_CURRENT_WEEK = "ScrollToCurrentWeek";

export interface ScrollToCurrentWeek {
    type: typeof SCROLL_TO_CURRENT_WEEK;
}

export function scrollToCurrentWeek(): ScrollToCurrentWeek {
    return {
        type: SCROLL_TO_CURRENT_WEEK
    };
}

// Requests

export const LOAD_NOTES_REQUEST = "LoadNotesRequest";

export interface LoadNotesRequest {
    type: typeof LOAD_NOTES_REQUEST;
    reqID: number;
    month: Month;
}

export function loadNotesRequest(reqID: number, month: Month): LoadNotesRequest {
    return {
        type: LOAD_NOTES_REQUEST,
        reqID, month
    };
}

export const LOAD_NOTES_SUCCESS = "LoadNotesSuccess";

export interface LoadNotesSuccess {
    type: typeof LOAD_NOTES_SUCCESS;
    reqID: number;
    month: Month;
    notes: Note[];
}

export function loadNotesSuccess(reqID: number, month: Month, notes: Note[]): LoadNotesSuccess {
    return {
        type: LOAD_NOTES_SUCCESS,
        reqID, month, notes
    };
}

export const CREATE_NOTE_REQUEST = "CreateNoteRequest";

export interface CreateNoteRequest {
    type: typeof CREATE_NOTE_REQUEST;
    reqID: number;
    date: DateTime;
    text: string;
}

export function createNoteRequest(reqID: number, date: DateTime, text: string): CreateNoteRequest {
    return {
        type: CREATE_NOTE_REQUEST,
        reqID, date, text
    };
}

export const CREATE_NOTE_SUCCESS = "CreateNoteSuccess";

export interface CreateNoteSuccess {
    type: typeof CREATE_NOTE_SUCCESS;
    reqID: number;
    note: Note;
}

export function createNoteSuccess(reqID: number, note: Note): CreateNoteSuccess {
    return {
        type: CREATE_NOTE_SUCCESS,
        reqID, note
    };
}

export const UPDATE_NOTE_REQUEST = "UpdateNoteRequest";

export interface UpdateNoteRequest {
    type: typeof UPDATE_NOTE_REQUEST;
    reqID: number;
    note: Note;
    oldDate: DateTime;
}

export function updateNoteRequest(reqID: number, note: Note, oldDate: DateTime): UpdateNoteRequest {
    return {
        type: UPDATE_NOTE_REQUEST,
        reqID, note, oldDate
    };
}

export const UPDATE_NOTE_SUCCESS = "UpdateNoteSuccess";

export interface UpdateNoteSuccess {
    type: typeof UPDATE_NOTE_SUCCESS;
    reqID: number;
    note: Note;
    oldDate: DateTime;
}

export function updateNoteSuccess(reqID: number, note: Note, oldDate: DateTime): UpdateNoteSuccess {
    return {
        type: UPDATE_NOTE_SUCCESS,
        reqID, note, oldDate
    };
}

export const DELETE_NOTE_REQUEST = "DeleteNoteRequest";

export interface DeleteNoteRequest {
    type: typeof DELETE_NOTE_REQUEST;
    reqID: number;
    note: Note;
}

export function deleteNoteRequest(reqID: number, note: Note): DeleteNoteRequest {
    return {
        type: DELETE_NOTE_REQUEST,
        reqID, note
    };
}

export const DELETE_NOTE_SUCCESS = "DeleteNoteSuccess";

export interface DeleteNoteSuccess {
    type: typeof DELETE_NOTE_SUCCESS;
    reqID: number;
    note: Note;
}

export function deleteNoteSuccess(reqID: number, note: Note): DeleteNoteSuccess {
    return {
        type: DELETE_NOTE_SUCCESS,
        reqID, note
    };
}

export type Action =
    NewNote | OpenNote | CloseDialog |
    LoadNotesRequest | LoadNotesSuccess |
    CreateNoteRequest | CreateNoteSuccess |
    UpdateNoteRequest | UpdateNoteSuccess |
    DeleteNoteRequest | DeleteNoteSuccess |
    ScrollToCurrentWeek;

export type Request =
    LoadNotesRequest | LoadNotesSuccess |
    CreateNoteRequest | CreateNoteSuccess |
    UpdateNoteRequest | UpdateNoteSuccess |
    DeleteNoteRequest | DeleteNoteSuccess;
