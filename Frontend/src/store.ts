import { Action } from "./actions";

export interface Month {
    readonly year: number;
    readonly month: number;
}

export interface Day {
    readonly year: number;
    readonly month: number;
    readonly day: number;
}

export interface Time {
    readonly hours: number;
    readonly minutes: number;
}

export interface DateTime extends Day, Time {
}

export interface Note {
    readonly id: number;
    readonly date: DateTime;
    readonly text: string;
}

export interface DayNotes {
    readonly [day: string]: ReadonlyArray<Note>;
}

export interface MonthNotes {
    readonly [month: string]: DayNotes;
}

export interface NoDialog {
    type: "NoDialog";
}

export interface CreateNoteDialog {
    type: "CreateNoteDialog";
    readonly date: DateTime;
}

export interface EditNoteDialog {
    type: "EditNoteDialog";
    readonly note: Note;
}

export type Dialog = NoDialog | CreateNoteDialog | EditNoteDialog;

export interface ApplicationState {
    readonly scrollToCurrentMonth: number;
    readonly notes: MonthNotes;
    readonly dialog: Dialog;
    readonly requests: ReadonlyArray<Action>;
}
