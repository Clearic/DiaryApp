import { Action } from "./actions";

export interface YearMonth {
    readonly year: number;
    readonly month: number;
}

export interface YearMonthDay {
    readonly year: number;
    readonly month: number;
    readonly day: number;
}

export interface Time {
    readonly hours: number;
    readonly minutes: number;
}

export interface DateTime extends YearMonthDay, Time { }

export interface Note {
    readonly id: number;
    readonly date: DateTime;
    readonly text: string;
}

export type DayNotes = readonly Note[];

export interface MonthNotes {
    readonly [day: string]: DayNotes | undefined;
}

export interface Notes {
    readonly [month: string]: MonthNotes | undefined;
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
    readonly notes: Notes;
    readonly dialog: Dialog;
    readonly requests: readonly Action[];
}
