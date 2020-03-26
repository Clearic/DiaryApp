import { notesReducer } from "./notesReducer";
import { loadNotesSuccess, createNoteSuccess, updateNoteSuccess, deleteNoteSuccess } from "../actions";
import * as YM from "../year-month";
import * as YMD from "../year-month-day";

describe("notesReducer", () => {
    const reducer = notesReducer;
    const km = (year: number, month: number) => YM.getKey({ year, month });
    const kd = (year: number, month: number, day: number) => YMD.getKey({ year, month, day });
    const mkD = (year: number, month: number, day: number) => ({ year, month, day });
    const mkDT = (year: number, month: number, day: number, hours: number, minutes: number) => ({ year, month, day, hours, minutes });
    const mkNote = (id: number, date: ReturnType<typeof mkDT>, text: string) => ({ id, date, text });
    interface StateBuilder {
        add(date: ReturnType<typeof mkD>, ...notes: ReturnType<typeof mkNote>[]): void;
    }
    const buildState = (fn: (builder: StateBuilder) => void) => {
        let result: ReturnType<typeof reducer> = {};
        const builder: StateBuilder = {
            add(date, ...notes) {
                const monthKey = km(date.year, date.month);
                const dayKey = kd(date.year, date.month, date.day);
                const notesForMonth = { ...result[monthKey], [dayKey]: notes };
                result = { ...result, [monthKey]: notesForMonth };
            }
        }
        fn(builder);
        return result;
    }

    test("loadNotesSuccess initialState = undefined", () => {
        const notes = [
            mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
            mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"),
            mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3")
        ];

        const result = reducer(undefined, loadNotesSuccess(1, { year: 2020, month: 3 }, notes));

        const expected = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
        });
        expect(result).toEqual(expected);
    });

    test("loadNotesSuccess should not change notes for other months", () => {
        const notes = [
            mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"),
            mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"),
            mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6")
        ];
        const initState = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
        });;

        const result = reducer(initState, loadNotesSuccess(1, { year: 2020, month: 4 }, notes));

        expect(result[km(2020, 3)]).toBe(initState[km(2020, 3)]);
    });

    test("loadNotesSuccess if notes for the month exist replace them", () => {
        const notes = [
            mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
            mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"),
            mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"),
            mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9")
        ];
        const initState = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"));
        });;

        const result = reducer(initState, loadNotesSuccess(1, { year: 2020, month: 3 }, notes));

        const expected = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"));
        });
        expect(result).toEqual(expected);
    });

    test("createNoteSuccess initialState = undefined", () => {
        const note = mkNote(10, mkDT(2020, 4, 5, 12, 0), "This is a test");

        const result = reducer(undefined, createNoteSuccess(1, note));

        const expected = buildState(b => {
            b.add(mkD(2020, 4, 5), mkNote(10, mkDT(2020, 4, 5, 12, 0), "This is a test"));
        }); 
        expect(result).toEqual(expected);
    });

    test("createNoteSuccess", () => {
        const initState = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"));
        });
        const notes = [
            mkNote(10, mkDT(2020, 5, 15, 12, 0), "New Note 1"),
            mkNote(11, mkDT(2020, 4, 7, 15, 0), "New Note 2"),
            mkNote(12, mkDT(2020, 4, 8, 14, 0), "New Note 3")
        ];

        const result = notes.map((note, i) => createNoteSuccess(i, note)).reduce(reducer, initState);

        const expected = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"), notes[1]);
            b.add(mkD(2020, 4, 8), notes[2]);
            b.add(mkD(2020, 5, 15), notes[0]);
        });;
        expect(result).toEqual(expected);
    });

    test("updateNoteSuccess", () => {
        const initState = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"));
        });
        const notes = [
            mkNote(1, mkDT(2020, 3, 1, 10, 0), "Updated Note 1"),
            mkNote(6, mkDT(2020, 4, 7, 12, 0), "Updated Note 2")
        ];

        const result = notes.map((note, i) => updateNoteSuccess(i, note, note.date)).reduce(reducer, initState);

        const expected = buildState(b => {
            b.add(mkD(2020, 3, 1),
                notes[0],
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), notes[1]);
        });
        expect(result).toEqual(expected);
    });

    test("updateNoteSuccess if date is changed should move note to a new month/day", () => {
        const initState = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"));
        });
        const note = mkNote(2, mkDT(2020, 4, 8, 12, 0), "Updated Note");

        const result = reducer(initState, updateNoteSuccess(1, note, mkDT(2020, 3, 1, 15, 0)));

        const expected = buildState(b => {
            b.add(mkD(2020, 3, 1), mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"));
            b.add(mkD(2020, 4, 8), note);
        });
        expect(result).toEqual(expected);
    });

    test("deleteNoteSuccess", () => {
        const initState = buildState(b => {
            b.add(mkD(2020, 3, 1),
                mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1"),
                mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"));
        });
        const note = mkNote(1, mkDT(2020, 3, 1, 10, 0), "This is a test 1");

        const result = reducer(initState, deleteNoteSuccess(1, note));

        const expected = buildState(b => {
            b.add(mkD(2020, 3, 1), mkNote(2, mkDT(2020, 3, 1, 15, 0), "This is a test 2"));
            b.add(mkD(2020, 3, 3), mkNote(3, mkDT(2020, 3, 3, 12, 0), "This is a test 3"));
            b.add(mkD(2020, 3, 9), mkNote(7, mkDT(2020, 3, 9, 12, 0), "This is a test 9"));
            b.add(mkD(2020, 4, 1), mkNote(4, mkDT(2020, 4, 1, 10, 0), "This is a test 4"));
            b.add(mkD(2020, 4, 5), mkNote(5, mkDT(2020, 4, 5, 15, 0), "This is a test 5"));
            b.add(mkD(2020, 4, 7), mkNote(6, mkDT(2020, 4, 7, 12, 0), "This is a test 6"));
        });
        expect(result).toEqual(expected);
    });
});




