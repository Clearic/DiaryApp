import * as React from "react";
import { connect } from "react-redux";
import { MonthComponent } from "./Month";
import { ApplicationState, Month, MonthNotes, DayNotes } from "../store";
import * as Actions from "../actions";
import * as Thunks from "../thunks";
import {
    getCurrentMonth,
    getPrevMonth,
    getNextMonth,
    getMonthKey,
    isMonthGreater,
    isMonthLess,
    getWeekOfMonth
} from "../date";
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
        return yearMonthToIndex(year.year, year.year);
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

const emptyNotes: DayNotes = {};

interface MonthListComponentProps {
    readonly notes: MonthNotes;
    readonly scrollToCurrentMonth: number;
    dispatch(action: Actions.Action | Thunks.ThunkAction): Actions.Action;
}

export const MonthListComponent: React.FC<MonthListComponentProps> = ({ notes, dispatch }) => {
    const getItemData = (index: number): DayNotes => {
        // no notes for future dates cause they cannot be created
        if (index > startIndex) {
            return emptyNotes;
        }

        const month = indexToYearMonth(index);
        const monthKey = getMonthKey(month);
        return notes[monthKey];
    }

    const renderItem = (notes: DayNotes, index: number): React.ReactElement => {
        return <MonthComponent
            {...indexToYearMonth(index)}
            notes={notes}
            dispatch={dispatch} />;
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

function mapStateToProps(state: ApplicationState) {
    return {
        notes: state.notes,
        scrollToCurrentMonth: state.scrollToCurrentMonth
    };
}

export const MonthListContainer = connect(mapStateToProps)(MonthListComponent);
