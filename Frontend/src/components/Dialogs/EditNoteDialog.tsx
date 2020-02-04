import * as React from "react";
import * as Actions from "../../actions";
import * as Thunks from "../../thunks";
import { Note, DateTime } from "../../store";
import { getTitle } from "../../utils";
import { dateToFromStr, timeToFromStr, isDateTimeEqual, parseFormDate, parseFormTime, isFutureDate } from "../../date";
import { DialogWithExpander } from "./DialogWithExpander";
import { MenuDialogComponent } from "./MenuDialog";
import { LabeledField } from "./LabeledField";

export interface EditNoteDialogProps {
    readonly note: Note;
    dispatch(action: Actions.Action | Thunks.ThunkAction): Actions.Action;
}

export const EditNoteDialogComponenet: React.FC<EditNoteDialogProps> = (props) => {
    const [text, setText] = React.useState(props.note.text);
    const [date, setDate] = React.useState(dateToFromStr(props.note.date));
    const [time, setTime] = React.useState(timeToFromStr(props.note.date));

    const handleTextChange = (el: React.FormEvent<HTMLTextAreaElement>) => {
        setText(el.currentTarget.value);
    }
    const handleDateChange = (el: React.FormEvent<HTMLInputElement>) => {
        setDate(el.currentTarget.value);
    }
    const handleTimeChange = (el: React.FormEvent<HTMLInputElement>) => {
        setTime(el.currentTarget.value);
    }
    const handleCloseClick = () => {
        props.dispatch(Actions.closeDialog());
    }
    const handleDeleteClick = () => {
        if (confirm("Are you sure you want to delete?")) {
            props.dispatch(Actions.closeDialog());
            props.dispatch(Thunks.deleteNote(props.note));
        }
    }
    const handleSaveClick = () => {
        if (!dt)
            return;

        const note: Note = {
            id: props.note.id,
            date: dt,
            text: text
        };
        props.dispatch(Thunks.updateNote(note, props.note.date));
        props.dispatch(Actions.closeDialog());
    }

    const d = parseFormDate(date);
    const t = parseFormTime(time);
    const dt: DateTime | null = (d && t) ? { ...d, ...t } : null;

    const isDirty = text !== props.note.text || (dt && !isDateTimeEqual(props.note.date, dt));

    const isDateValid = !!d && !isFutureDate(d);
    const isTimeValid = !!t;
    const isFormValid = isDateValid && isTimeValid;

    return (
        <DialogWithExpander
            headerArea={
                <>
                    <div className="bar-title">{getTitle(text) || ""}</div>

                    <MenuDialogComponent items={[
                        { title: "Delete", action: handleDeleteClick },
                        { title: "Close", action: handleCloseClick }
                    ]} />

                    {isDirty ?
                        <button className="bar-button" onClick={handleSaveClick} disabled={!isFormValid}>Save</button>
                        :
                        <button className="bar-button" onClick={handleCloseClick}>Close</button>
                    }
                </>
            }
            expanderArea={
                <>
                    <LabeledField id="ndate" label="Date" type="date" value={date} isValid={isDateValid} onChange={handleDateChange} />
                    <LabeledField id="ntime" label="Time" type="time" value={time} isValid={isTimeValid} onChange={handleTimeChange} />
                </>
            }
            contentArea={
                <textarea value={text} onChange={handleTextChange} />
            } />
    );
}