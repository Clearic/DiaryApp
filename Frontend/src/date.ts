import { Month, Day, DateTime, Time } from "./store";

// Month

export function getCurrentMonth(): Month {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return {year, month};
}

export function getPrevMonth(fromMonth: Month): Month {
    let {year, month} = fromMonth;
    month--;
    if (month < 1) {
        month = 12;
        year--;
    }
    return {year, month};
}

export function getNextMonth(fromMonth: Month): Month {
    let {year, month} = fromMonth;
    month++;
    if (month > 12) {
        month = 1;
        year++;
    }
    return {year, month};
}

export function isMonthEqual(month1: Month, month2: Month): boolean {
    return month1.year === month2.year && month1.month === month2.month;
}

export function isMonthGreater(month1: Month, month2: Month): boolean {
    if (month1.year > month2.year)
        return true;

    if (month1.year === month2.year) {
        return month1.month > month2.month;
    }

    return false;
}

export function isMonthLess(month1: Month, month2: Month): boolean {
    if (month1.year < month2.year)
        return true;

    if (month1.year === month2.year) {
        return month1.month < month2.month;
    }

    return false;
}

export function getMonthKey({year, month}: Month): string {
    let result = "";
    if (year < 1000)
        throw Error("Years less than 1000 not supported");

    result += year.toString();
    result += month < 10 ? `0${month}` : month.toString();
    return result;
}

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function getMonthName(month: number): string {
    if (month < 1 || month > 12) {
        throw RangeError(`Out of range argument month = ${month}`);
    }
    return monthNames[month - 1];
}

function getMonthOffset(month: Month) {
    const day = new Date(month.year, month.month - 1);
    let offset = day.getDay();
    offset = (offset + 6) % 7; // make monday first day of week
    return offset;
}

export function getWeekOfMonth(month: Month, day: number) {
    const offset = getMonthOffset(month);
    const normalizedDay = Math.max(0, day + offset) - 1;
    return Math.floor(normalizedDay / 7) + 1;
}

// Day

export function isDayEqual(day1: Day, day2: Day): boolean {
    return day1.year === day2.year &&
        day1.month === day2.month &&
        day1.day === day2.day;
}

export function isDayLess(day1: Day, day2: Day): boolean {
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

export function isDayGreater(day1: Day, day2: Day): boolean {
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

export function getDayKey(day: Day) {
    return `${day.year}-${day.month}-${day.day}`;
}

export function parseDayKey(key: string): Day {
    const regex = /(\d+)-(\d+)-(\d+)/;
    const m = regex.exec(key);
    if (!m)
        throw Error(`Failed to parse day key ${key}`);
    const year = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const day = parseInt(m[3], 10);
    return {year, month, day};
}

export function getDaysInMonth(month: Month): number {
    return new Date(month.year, month.month, 0).getDate();
}

const dayOfWeekNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
];

export function getDayOfWeekName(day: number) {
    return dayOfWeekNames[day];
}

// DateTime

export function makeDateTime(year: number, month: number, day: number, hours: number, minutes: number): DateTime {
    return {year, month, day, hours, minutes};
}

export function getCurrentDateTime(): DateTime {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hours: now.getHours(),
        minutes: now.getMinutes()
    };
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

export function parseDateTime(str: string): DateTime {
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

export function dateTimeToStr(date: DateTime): string {
    const month = date.month < 10 ? `0${date.month}` : `${date.month}`;
    const day = date.day < 10 ? `0${date.day}` : `${date.day}`;
    const hours = date.hours < 10 ? `0${date.hours}` : `${date.hours}`;
    const minutes = date.minutes < 10 ? `0${date.minutes}` : `${date.minutes}`;
    return `${date.year}-${month}-${day} ${hours}:${minutes}`;
}

// Form Date and Time

export function dateToFromStr(date: Day) {
    const month = date.month < 10 ? `0${date.month}` : `${date.month}`;
    const day = date.day < 10 ? `0${date.day}` : `${date.day}`;
    return `${date.year}-${month}-${day}`;
}

export function parseFormDate(str: string): Day {
    const regex = /(\d+)-(\d+)-(\d+)/;
    const m = regex.exec(str);
    if (!m)
        throw Error(`Failed to parse date ${str}`);
    return {
        year: parseInt(m[1], 10),
        month: parseInt(m[2], 10),
        day: parseInt(m[3], 10)
    };
}

export function timeToFromStr(time: Time) {
    const hours = time.hours < 10 ? `0${time.hours}` : `${time.hours}`;
    const minutes = time.minutes < 10 ? `0${time.minutes}` : `${time.minutes}`;
    return `${hours}:${minutes}`;
}

export function parseFormTime(str: string): Time {
    const regex = /(\d+):(\d+)/;
    const m = regex.exec(str);
    if (!m)
        throw Error(`Failed to parse time ${str}`);
    return {
        hours: parseInt(m[1], 10),
        minutes: parseInt(m[2], 10)
    };
}
