import * as React from "react";
import { DayNotes } from "../store";
import * as Actions from "../actions";
import { DayComponent } from "./Day";

export interface WeekComponentProps {
    readonly year: number;
    readonly month: number;
    readonly week: ReadonlyArray<number | undefined>;
    readonly notes: DayNotes | undefined;
    dispatch(action: Actions.Action): Actions.Action;
}

export function WeekComponent(props: WeekComponentProps) {
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