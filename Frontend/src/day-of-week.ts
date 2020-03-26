import { YearMonth } from "./types";

export const SUNDAY = 0;
export const MONDAY = 1;
export const TUESDAY = 2;
export const WEDNESDAY = 3;
export const THURSDAY = 4;
export const FRIDAY = 5;
export const SATURDAY = 6;

const dayOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function getDayOfWeekName(day: number): string {
    return dayOfWeekNames[day];
}

function getMonthOffset(month: YearMonth) {
    const day = new Date(month.year, month.month - 1);
    let offset = day.getDay();
    offset = (offset + 6) % 7; // make monday first day of week
    return offset;
}

export function getWeekOfMonth(month: YearMonth, day: number) {
    const offset = getMonthOffset(month);
    const normalizedDay = Math.max(0, day + offset) - 1;
    return Math.floor(normalizedDay / 7) + 1;
}
