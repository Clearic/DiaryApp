import * as React from "react";
import { MonthNotes } from "../store";
import * as Actions from "../actions";
import { getMonthKey, getMonthName} from "../date";
import { WeekComponent } from "./Week";

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
