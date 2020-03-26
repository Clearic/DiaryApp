import { YearMonth } from "./types";

export function fromDate(date: Date): YearMonth {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return { year, month };
}

export function toDate(month: YearMonth): Date {
    return new Date(month.year, month.month - 1);
}

export function getPrevMonth(fromMonth: YearMonth): YearMonth {
    let { year, month } = fromMonth;
    month--;
    if (month < 1) {
        month = 12;
        year--;
    }
    return { year, month };
}

export function getNextMonth(fromMonth: YearMonth): YearMonth {
    let { year, month } = fromMonth;
    month++;
    if (month > 12) {
        month = 1;
        year++;
    }
    return { year, month };
}

export function isEqual(month1: YearMonth, month2: YearMonth): boolean {
    return month1.year === month2.year && month1.month === month2.month;
}

export function isGreater(month1: YearMonth, month2: YearMonth): boolean {
    if (month1.year > month2.year)
        return true;

    if (month1.year === month2.year) {
        return month1.month > month2.month;
    }

    return false;
}

export function isLess(month1: YearMonth, month2: YearMonth): boolean {
    if (month1.year < month2.year)
        return true;

    if (month1.year === month2.year) {
        return month1.month < month2.month;
    }

    return false;
}

export function getKey({ year, month }: YearMonth): string {
    let result = "";
    if (year < 1000)
        throw Error("Years less than 1000 not supported");

    result += year.toString();
    result += month < 10 ? `0${month}` : month.toString();
    return result;
}
