import * as React from "react";
import { MonthNotes } from "../types";
import { DayComponent } from "./Day";
import { getMonthName } from "../month";

interface MonthProps {
    readonly year: number;
    readonly month: number;
    readonly notes: MonthNotes;
}

export const MonthComponent: React.FC<MonthProps> = ({ year, month, notes }) => {
    const weeks = getWeeks(year, month);

    return (
        <table className="month">
            <caption>{getMonthName(month)} {year}</caption>
            <tbody>
                {weeks.map((week, weekIndex) =>
                    <tr key={weekIndex}>
                        {week.map((day, dayIndex) =>
                            <DayComponent
                                key={dayIndex}
                                year={year}
                                month={month}
                                day={day}
                                notes={notes}
                            />)}
                    </tr>
                )}
            </tbody>
        </table>
    );
}

function getWeeks(year: number, month: number) {
    const day = new Date(year, month - 1);
    let offset = day.getDay();
    offset = (offset + 6) % 7;

    const weeks: Array<Array<number | undefined>> = [];

    while (day.getMonth() === month - 1) {
        const week: Array<number | undefined> = [];
        for (let i = 0; i < 7; i++) {
            if (offset > 0) {
                offset--;
                week.push(undefined);
            } else if (day.getMonth() === month - 1) {
                week.push(day.getDate());
                day.setDate(day.getDate() + 1);
            } else {
                week.push(undefined);
            }
        }
        weeks.push(week);
    }
    return weeks;
}
