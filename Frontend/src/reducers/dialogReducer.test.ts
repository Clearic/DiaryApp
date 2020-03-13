import { dialogReducer } from "./dialogReducer";
import { newNote, openNote, closeDialog } from "../actions";
import { Dialog, DateTime, Note } from "../types";

describe("dialogReducer", () => {
    test("newNote", () => {
        const date: DateTime = { year: 2020, month: 3, day: 10, hours: 15, minutes: 0 };
        const result = dialogReducer(undefined, newNote(date));

        const expected: Dialog = {
            type: "CreateNoteDialog",
            date
        };
        expect(result).toEqual(expected);
    });

    test("newNote", () => {
        const date: DateTime = { year: 2020, month: 3, day: 10, hours: 15, minutes: 0 };
        const note: Note = { id: 10, text: "This is a test", date };
        const result = dialogReducer(undefined, openNote(note));

        const expected: Dialog = {
            type: "EditNoteDialog",
            note
        };
        expect(result).toEqual(expected);
    });

    test("closeDialog", () => {
        const init: Dialog = {
            type: "CreateNoteDialog",
            date: { year: 2020, month: 3, day: 10, hours: 15, minutes: 0 }
        }
        const result = dialogReducer(init, closeDialog());

        const expected: Dialog = {
            type: "NoDialog"
        };
        expect(result).toEqual(expected);
    });
});