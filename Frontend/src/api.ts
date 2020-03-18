import { Note, YearMonth, DateTime } from "./types";
import { getDaysInMonth, dateTimeToStr, parseDateTime } from "./date";

export async function getNotes(month: YearMonth) {
    const from = `${month.year}-${month.month}-1`;
    const to = `${month.year}-${month.month}-${getDaysInMonth(month)}`;

    const response = await fetch(`/api/notes?from=${from}&to=${to}`);
    const json = await response.json();
    return json.map((n: any) => ({
        id: n.id,
        date: parseDateTime(n.date),
        text: n.text
    } as Note));
}


export async function createNote(dt: DateTime, text: string) {
    const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ date: dateTimeToStr(dt), text })
    });
    const json = await response.json();
    return json as {id: number};
}

export async function updateNote(note: Note) {
    const response = await fetch(`/api/notes/${note.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ date: dateTimeToStr(note.date), text: note.text })
    });
    return {id: note.id};
}

export async function deleteNote(note: Note) {
    const response = await fetch(`/api/notes/${note.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return {id: note.id};
}
