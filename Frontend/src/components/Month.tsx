import * as React from "react";
import { Note, MonthNotes, DayNotes } from "../store";
import * as Actions from "../actions";
import { isEmptyOrSpaces, getTitle } from "../utils";
import { getMonthKey,
    getDayKey,
    getMonthName,
    getCurrentDateTime,
    isDayLess
} from "../date";

function getWeeks(year: number, month: number) {
    const day = new Date(year, month - 1);
    let offset = day.getDay();
    offset = (offset + 6) % 7; // make monday first day of week

    const weeks: Array<Array<number | undefined>> = [];

    while (day.getMonth() === month - 1) {
        const week: Array<number | undefined> = [];
        for (let i = 0; i < 7; i++) {
            if (offset > 0) {
                offset--;
                week.push(undefined);
            } else if (day.getMonth() === month - 1) {
                week.push(day.getDate());
                day.setDate(day.getDate() + 1); // adds 1 day
            } else {
                week.push(undefined);
            }
        }
        weeks.push(week);
    }
    return weeks;
}

function getSnippet(text: string): string | undefined {
    let snip = "";

    const line1 = text.indexOf("\n");
    if (line1 === -1)
        return undefined;

    let prevLine = line1;
    let nextLine = line1;
    do {
        prevLine = nextLine;
        nextLine = text.indexOf("\n", prevLine + 1);
        if (nextLine === -1) {
            snip = text.substr(prevLine + 1);
        } else {
            snip = text.substring(prevLine + 1, nextLine);
        }
    } while (nextLine !== -1 && isEmptyOrSpaces(snip));

    if (isEmptyOrSpaces(snip))
        return undefined;

    if (snip.length > 70) {
        snip = `${snip.substr(0, 70)}...`;
    }

    return snip;
}

interface NoteComponentProps {
    readonly note: Note;
    dispatch(action: Actions.Action): Actions.Action;
}

function NoteComponent(props: NoteComponentProps) {
    const title = getTitle(props.note.text) || "<Untitled>";
    const snippet = getSnippet(props.note.text);

    const handleClick = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        props.dispatch(Actions.openNote(props.note));
    };

    return (
        <div className="note" onClick={handleClick}>
            <header>{title}</header>
            {snippet && <p>{snippet}</p>}
        </div>
    );
}

interface DayComponentProps {
    readonly year: number;
    readonly month: number;
    readonly day: number | undefined;
    readonly notes: DayNotes | undefined;
    dispatch(action: Actions.Action): Actions.Action;
}

function DayComponent(props: DayComponentProps) {
    const {year, month, day} = props;

    if (day === undefined) {
        return <td className="null"></td>;
    }

    if (isDayLess(getCurrentDateTime(), {year, month, day})) {
        return <td>{day}</td>;
    }

    let notes;

    if (props.notes) {
        const date = getDayKey({year, month, day});
        notes = props.notes[date];
    }

    const handleDayClick = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        props.dispatch(Actions.newNote({year, month, day, hours: 0, minutes: 0}));
    };

    return (
        <td>
            <button onClick={handleDayClick}>{day}</button>
            {notes && notes.map((x, i) => <NoteComponent key={x.id} note={x} dispatch={props.dispatch} />)}
        </td>
    );
}

interface WeekComponentProps {
    readonly year: number;
    readonly month: number;
    readonly week: ReadonlyArray<number | undefined>;
    readonly notes: DayNotes | undefined;
    dispatch(action: Actions.Action): Actions.Action;
}

function WeekComponent(props: WeekComponentProps) {
    const {year, month, week, notes} = props;

    return (
        <tr>
            {week.map((x, i) =>
                <DayComponent
                    key={i}
                    year={year}
                    month={month}
                    day={x}
                    notes={notes}
                    dispatch={props.dispatch}
                />)}
        </tr>
    );
}

interface MonthComponentProps {
    readonly year: number;
    readonly month: number;
    readonly notes: MonthNotes;
    readonly className: string;
    dispatch(action: Actions.Action): Actions.Action;
}

export function MonthComponent(props: MonthComponentProps) {
    const {year, month} = props;
    const monthKey = getMonthKey({year, month});
    const notes = props.notes[monthKey];
    const weeks = getWeeks(year, month);

    return (
        <table id={monthKey} className={props.className}>
            <caption>{getMonthName(month)} {year}</caption>
            <tbody>
                {weeks.map((w, i) =>
                    <WeekComponent
                        key={i}
                        year={year}
                        month={month}
                        week={w}
                        notes={notes}
                        dispatch={props.dispatch}
                    />
                )}
            </tbody>
        </table>
    );
}
