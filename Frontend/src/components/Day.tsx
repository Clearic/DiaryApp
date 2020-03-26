import * as React from "react";
import { useDispatch } from "react-redux";
import { MonthNotes } from "../types";
import * as Actions from "../actions";
import { NoteComponent } from "./Note";
import * as YMD from "../year-month-day";
import { getCurrentDateTime } from "../date-time";

export interface DayComponentProps {
    readonly year: number;
    readonly month: number;
    readonly day: number | undefined;
    readonly notes: MonthNotes | undefined;
}

export function DayComponent(props: DayComponentProps) {
    const { year, month, day } = props;
    const dispatch = useDispatch();

    if (day === undefined) {
        return <td className="null"></td>;
    }

    if (YMD.isLess(getCurrentDateTime(), { year, month, day })) {
        return <td>{day}</td>;
    }

    let notes;

    if (props.notes) {
        const date = YMD.getKey({ year, month, day });
        notes = props.notes[date];
    }

    const handleDayClick = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(Actions.newNote({ year, month, day, hours: 0, minutes: 0 }));
    };

    return (
        <td>
            <button onClick={handleDayClick}>{day}</button>
            {notes && notes.map((x) => <NoteComponent key={x.id} note={x} />)}
        </td>
    );
}
