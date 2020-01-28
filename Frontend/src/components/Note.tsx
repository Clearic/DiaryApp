import * as React from "react";
import { Note } from "../store";
import * as Actions from "../actions";
import { isEmptyOrSpaces, getTitle } from "../utils";

function getSnippet(text: string): string | undefined {
    let snip = "";

    const line1 = text.indexOf("\n");
    if (line1 === -1)
        return undefined;

    let prevLine = line1;
    let nextLine = line1;
    do {
        prevLine = nextLine;
        nextLine = text.indexOf("\n", prevLine + 1);
        if (nextLine === -1) {
            snip = text.substr(prevLine + 1);
        } else {
            snip = text.substring(prevLine + 1, nextLine);
        }
    } while (nextLine !== -1 && isEmptyOrSpaces(snip));

    if (isEmptyOrSpaces(snip))
        return undefined;

    if (snip.length > 70) {
        snip = `${snip.substr(0, 70)}...`;
    }

    return snip;
}

export interface NoteComponentProps {
    readonly note: Note;
    dispatch(action: Actions.Action): Actions.Action;
}

export function NoteComponent(props: NoteComponentProps) {
    const title = getTitle(props.note.text) || "<Untitled>";
    const snippet = getSnippet(props.note.text);

    const handleClick = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        props.dispatch(Actions.openNote(props.note));
    };

    return (
        <div className="note" onClick={handleClick}>
            <header>{title}</header>
            {snippet && <p>{snippet}</p>}
        </div>
    );
}