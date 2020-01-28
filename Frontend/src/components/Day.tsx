import * as React from "react";
import { DayNotes } from "../store";
import * as Actions from "../actions";
import { getDayKey, getCurrentDateTime, isDayLess } from "../date";
import { NoteComponent } from "./Note";

export interface DayComponentProps {
    readonly year: number;
    readonly month: number;
    readonly day: number | undefined;
    readonly notes: DayNotes | undefined;
    dispatch(action: Actions.Action): Actions.Action;
}

export function DayComponent(props: DayComponentProps) {
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
            {notes && notes.map((x) => <NoteComponent key={x.id} note={x} dispatch={props.dispatch} />)}
        </td>
    );
}