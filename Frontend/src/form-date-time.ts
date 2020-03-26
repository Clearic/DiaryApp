import { Time, YearMonthDay } from "./types";

export function toFormDate(date: YearMonthDay): string {
    const month = date.month < 10 ? `0${date.month}` : `${date.month}`;
    const day = date.day < 10 ? `0${date.day}` : `${date.day}`;
    return `${date.year}-${month}-${day}`;
}

export function parseFormDate(str: string): YearMonthDay | null {
    const regex = /(\d+)-(\d+)-(\d+)/;
    const m = regex.exec(str);
    if (!m)
        return null;
    return {
        year: parseInt(m[1], 10),
        month: parseInt(m[2], 10),
        day: parseInt(m[3], 10)
    };
}

export function toFormTime(time: Time): string {
    const hours = time.hours < 10 ? `0${time.hours}` : `${time.hours}`;
    const minutes = time.minutes < 10 ? `0${time.minutes}` : `${time.minutes}`;
    return `${hours}:${minutes}`;
}

export function parseFormTime(str: string): Time | null {
    const regex = /(\d+):(\d+)/;
    const m = regex.exec(str);
    if (!m)
        return null;
    return {
        hours: parseInt(m[1], 10),
        minutes: parseInt(m[2], 10)
    };
}
