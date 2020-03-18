import { Note, Notes, MonthNotes, YearMonthDay } from "../types";
import { Action, LOAD_NOTES_SUCCESS, CREATE_NOTE_SUCCESS, UPDATE_NOTE_SUCCESS, DELETE_NOTE_SUCCESS } from "../actions";
import { Reducer } from "redux";
import { getMonthKey, getDayKey, isDateTimeEqual, isDateTimeLess } from "../date";

function makeDayNotes(notes: ReadonlyArray<Note>): MonthNotes {
    const result: {[day: string]: Note[]} = {};
    notes.forEach(note => {
        const arr = result[getDayKey(note.date)];
        if (arr) {
            arr.push(note);
        } else {
            result[getDayKey(note.date)] = [note];
        }
    });
    return result;
}

function sortNotesByDate(notes: Note[]) {
    notes.sort((n1, n2) => {
        if (isDateTimeEqual(n1.date, n2.date))
            return 0;
        else if (isDateTimeLess(n1.date, n2.date))
            return -1;
        else
            return 1;
    });
}

function addNote(state: MonthNotes = {}, note: Note) {
    const dayKey = getDayKey(note.date);
    let notes = (state[dayKey] || []) as Note[];
    notes = [...notes, note];
    sortNotesByDate(notes);
    return {...state, [dayKey]: notes};
}

function removeNote(state: MonthNotes = {}, id: number, date: YearMonthDay) {
    const dayKey = getDayKey(date);
    let notes = state[dayKey] || [];
    notes = notes.filter(x => x.id !== id);
    return {...state, [dayKey]: notes};
}

export const notesReducer: Reducer<Notes> = (state: Notes = {}, action: Action) => {
    switch (action.type) {
        case LOAD_NOTES_SUCCESS: {
            const monthKey = getMonthKey(action.month);
            return {...state, [monthKey]: makeDayNotes(action.notes)};
        }
        case CREATE_NOTE_SUCCESS: {
            const monthKey = getMonthKey(action.note.date);
            return {...state, [monthKey]: addNote(state[monthKey], action.note)};
        }
        case UPDATE_NOTE_SUCCESS: {
            const monthKey = getMonthKey(action.note.date);
            const oldMonthKey = getMonthKey(action.oldDate);
            const newState = {
                ...state,
                [oldMonthKey]: removeNote(state[oldMonthKey], action.note.id, action.oldDate)
            };
            return {...newState, [monthKey]: addNote(newState[monthKey], action.note)};
        }
        case DELETE_NOTE_SUCCESS: {
            const monthKey = getMonthKey(action.note.date);
            const newState = {
                ...state,
                [monthKey]: removeNote(state[monthKey], action.note.id, action.note.date)
            };
            return newState;
        }
    }
    return state;
};
