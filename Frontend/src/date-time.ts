import { DateTime } from "./types";

export function makeDateTime(year: number, month: number, day: number, hours: number, minutes: number): DateTime {
    return { year, month, day, hours, minutes };
}

export function fromDate(date: Date): DateTime {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hours: date.getHours(),
        minutes: date.getMinutes()
    };
}

export function getCurrentDateTime(): DateTime {
    return fromDate(new Date());
}

export function isDateTimeEqual(dt1: DateTime, dt2: DateTime) {
    return dt1.year === dt2.year &&
        dt1.month === dt2.month &&
        dt1.day === dt2.day &&
        dt1.hours === dt2.hours &&
        dt1.minutes === dt2.minutes;
}

export function isDateTimeLess(dt1: DateTime, dt2: DateTime) {
    if (dt1.year < dt2.year)
        return true;

    if (dt1.year === dt2.year && dt1.month < dt2.month) {
        return true;
    }

    if (dt1.year === dt2.year && dt1.month === dt2.month && dt1.day < dt2.day) {
        return true;
    }

    if (dt1.year === dt2.year && dt1.month === dt2.month && dt1.day === dt2.day &&
        dt1.hours < dt2.hours) {
        return true;
    }

    if (dt1.year === dt2.year && dt1.month === dt2.month && dt1.day === dt2.day &&
        dt1.hours === dt2.hours && dt1.minutes < dt2.minutes) {
        return true;
    }

    return false;
}

export function toStr(date: DateTime): string {
    const month = date.month < 10 ? `0${date.month}` : `${date.month}`;
    const day = date.day < 10 ? `0${date.day}` : `${date.day}`;
    const hours = date.hours < 10 ? `0${date.hours}` : `${date.hours}`;
    const minutes = date.minutes < 10 ? `0${date.minutes}` : `${date.minutes}`;
    return `${date.year}-${month}-${day} ${hours}:${minutes}`;
}

export function parse(str: string): DateTime {
    const regex = /(\d+)-(\d+)-(\d+) (\d+):(\d+)/;
    const m = regex.exec(str);
    if (!m)
        throw Error(`Failed to parse day key ${str}`);
    return {
        year: parseInt(m[1], 10),
        month: parseInt(m[2], 10),
        day: parseInt(m[3], 10),
        hours: parseInt(m[4], 10),
        minutes: parseInt(m[5], 10)
    };
}
