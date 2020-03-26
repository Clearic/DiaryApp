import { YearMonthDay } from "./types";

export function isEqual(day1: YearMonthDay, day2: YearMonthDay): boolean {
    return day1.year === day2.year &&
        day1.month === day2.month &&
        day1.day === day2.day;
}

export function isLess(day1: YearMonthDay, day2: YearMonthDay): boolean {
    if (day1.year < day2.year)
        return true;

    if (day1.year === day2.year && day1.month < day2.month) {
        return true;
    }

    if (day1.year === day2.year && day1.month === day2.month) {
        return day1.day < day2.day;
    }

    return false;
}

export function isGreater(day1: YearMonthDay, day2: YearMonthDay): boolean {
    if (day1.year > day2.year)
        return true;

    if (day1.year === day2.year && day1.month > day2.month) {
        return true;
    }

    if (day1.year === day2.year && day1.month === day2.month) {
        return day1.day > day2.day;
    }

    return false;
}

export function getKey(day: YearMonthDay) {
    return `${day.year}-${day.month}-${day.day}`;
}

export function parseKey(key: string): YearMonthDay {
    const regex = /(\d+)-(\d+)-(\d+)/;
    const m = regex.exec(key);
    if (!m)
        throw Error(`Failed to parse day key ${key}`);
    const year = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const day = parseInt(m[3], 10);
    return {year, month, day};
}

export function fromDate(date: Date): YearMonthDay {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    };
}

export const isFutureDate = (date: YearMonthDay): boolean => {
    return isGreater(date, fromDate(new Date()));
}
