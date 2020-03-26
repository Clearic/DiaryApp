import { YearMonth } from "./types";

export const JANUARY = 1;
export const FEBRUARY = 2;
export const MARCH = 3;
export const APRIL = 4;
export const MAY = 5;
export const JUNE = 6;
export const JULY = 7;
export const AUGUST = 8;
export const SEPTEMBER = 9;
export const OCTOBER = 10;
export const NOVEMBER = 11;
export const DECEMBER = 12;

const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

export function getMonthName(month: number): string {
    return monthNames[month - JANUARY];
}

export function getDaysInMonth(month: YearMonth): number {
    return new Date(month.year, month.month, 0).getDate();
}
