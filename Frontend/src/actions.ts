import { Note, Month, DateTime } from "./store";

export interface NewNote {
    type: "NewNote";
    date?: DateTime;
}

export function newNote(date?: DateTime): NewNote {
    return {
        type: "NewNote",
        date
    };
}

export interface OpenNote {
    type: "OpenNote";
    note: Note;
}

export function openNote(note: Note): OpenNote {
    return {
        type: "OpenNote",
        note
    };
}

export interface CloseDialog {
    type: "CloseDialog";
}

export function closeDialog(): CloseDialog {
    return {
        type: "CloseDialog"
    };
}

export interface ScrollToCurrentWeek {
    type: "ScrollToCurrentWeek";
}

export function scrollToCurrentWeek(): ScrollToCurrentWeek {
    return {
        type: "ScrollToCurrentWeek"
    };
}

// Requests

export interface LoadNotesRequest {
    type: "LoadNotesRequest";
    reqID: number;
    month: Month;
}

export function loadNotesRequest(reqID: number, month: Month): LoadNotesRequest {
    return {
        type: "LoadNotesRequest",
        reqID, month
    };
}

export interface LoadNotesSuccess {
    type: "LoadNotesSuccess";
    reqID: number;
    month: Month;
    notes: Note[];
}

export function loadNotesSuccess(reqID: number, month: Month, notes: Note[]): LoadNotesSuccess {
    return {
        type: "LoadNotesSuccess",
        reqID, month, notes
    };
}

export interface CreateNoteRequest {
    type: "CreateNoteRequest";
    reqID: number;
    date: DateTime;
    text: string;
}

export function createNoteRequest(reqID: number, date: DateTime, text: string): CreateNoteRequest {
    return {
        type: "CreateNoteRequest",
        reqID, date, text
    };
}

export interface CreateNoteSuccess {
    type: "CreateNoteSuccess";
    reqID: number;
    note: Note;
}

export function createNoteSuccess(reqID: number, note: Note): CreateNoteSuccess {
    return {
        type: "CreateNoteSuccess",
        reqID, note
    };
}

export interface UpdateNoteRequest {
    type: "UpdateNoteRequest";
    reqID: number;
    note: Note;
    oldDate: DateTime;
}

export function updateNoteRequest(reqID: number, note: Note, oldDate: DateTime): UpdateNoteRequest {
    return {
        type: "UpdateNoteRequest",
        reqID, note, oldDate
    };
}

export interface UpdateNoteSuccess {
    type: "UpdateNoteSuccess";
    reqID: number;
    note: Note;
    oldDate: DateTime;
}

export function updateNoteSuccess(reqID: number, note: Note, oldDate: DateTime): UpdateNoteSuccess {
    return {
        type: "UpdateNoteSuccess",
        reqID, note, oldDate
    };
}

export interface DeleteNoteRequest {
    type: "DeleteNoteRequest";
    reqID: number;
    note: Note;
}

export function deleteNoteRequest(reqID: number, note: Note): DeleteNoteRequest {
    return {
        type: "DeleteNoteRequest",
        reqID, note
    };
}

export interface DeleteNoteSuccess {
    type: "DeleteNoteSuccess";
    reqID: number;
    note: Note;
}

export function deleteNoteSuccess(reqID: number, note: Note): DeleteNoteSuccess {
    return {
        type: "DeleteNoteSuccess",
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
