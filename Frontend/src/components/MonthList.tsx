import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MonthComponent } from "./Month";
import { ApplicationState, MonthNotes } from "../types";
import * as Thunks from "../thunks";
import {
    getMonthKey} from "../date";
import { Scroller } from "./Scroller";

interface YearMonth {
    readonly year: number;
    readonly month: number
}

/** @param month must be in range 1 to 12 */
function yearMonthToIndex(year: number, month: number): number;
function yearMonthToIndex(yearMonth: YearMonth): number;
function yearMonthToIndex(year: number | YearMonth, month?: number): number {
    if (typeof year === "object") {
        return yearMonthToIndex(year.year, year.month);
    }

    if (month == null || month < 1 || month > 12) {
        throw new RangeError("The month must be in range 1 to 12.")
    }

    return year * 12 + month - 1;;
}

function indexToYearMonth(index: number): YearMonth {
    return {
        year: Math.floor(index / 12),
        month: index % 12 + 1
    };
}

function dateToIndex(date: Date) {
    return yearMonthToIndex(date.getFullYear(), date.getMonth() + 1);
}

const startIndex = dateToIndex(new Date());

const emptyNotes: MonthNotes = {};

export const MonthListComponent: React.FC = () => {
    const dispatch = useDispatch();

    const notes = useSelector((state: ApplicationState) => state.notes)

    const getItemData = (index: number): MonthNotes | undefined => {
        // no notes for future dates cause they cannot be created
        if (index > startIndex) {
            return emptyNotes;
        }

        const month = indexToYearMonth(index);
        const monthKey = getMonthKey(month);
        return notes[monthKey];
    }

    const renderItem = (notes: MonthNotes, index: number): React.ReactElement => {
        return <MonthComponent {...indexToYearMonth(index)} notes={notes} />;
    }

    const load = (index: number) => {
        const month = indexToYearMonth(index);
        dispatch(Thunks.loadNotes(month));
    }

    return (
        <Scroller
            startIndex={startIndex}
            getItemData={getItemData}
            renderItem={renderItem}
            load={load} />
    );
}
