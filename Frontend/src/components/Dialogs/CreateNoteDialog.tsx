import * as React from "react";
import { useDispatch } from "react-redux";
import * as Actions from "../../actions";
import * as Thunks from "../../thunks";
import { DateTime } from "../../types";
import { isEmptyOrSpaces, getTitle } from "../../utils";
import { DialogWithExpander } from "./DialogWithExpander";
import { MenuDialogComponent } from "./MenuDialog";
import { LabeledField } from "./LabeledField";
import { toFormDate, toFormTime, parseFormDate, parseFormTime } from "../../form-date-time";
import { isFutureDate } from "../../year-month-day";

export interface CreateNoteDialogProps {
    readonly date: DateTime;
}

export const CreateNoteDialogComponenet: React.FC<CreateNoteDialogProps> = (props) => {
    const dispatch = useDispatch();
    const [text, setText] = React.useState("");
    const [date, setDate] = React.useState(toFormDate(props.date));
    const [time, setTime] = React.useState(toFormTime(props.date));

    const handleTextChange = (el: React.FormEvent<HTMLTextAreaElement>) => {
        setText(el.currentTarget.value);
    }
    const handleDateChange = (el: React.FormEvent<HTMLInputElement>) => {
        setDate(el.currentTarget.value);
    }
    const handleTimeChange = (el: React.FormEvent<HTMLInputElement>) => {
        setTime(el.currentTarget.value);
    }
    const handleSaveClick = () => {
        if (!d || !t)
            return;
        const dt: DateTime = { ...d, ...t };
        dispatch(Thunks.createNote(dt, text));
        dispatch(Actions.closeDialog());
    }
    const handleCloseClick = () => {
        dispatch(Actions.closeDialog());
    }

    const isDirty = !isEmptyOrSpaces(text);

    const d = parseFormDate(date);
    const t = parseFormTime(time);

    const isDateValid = !!d && !isFutureDate(d);
    const isTimeValid = !!t;
    const isFormValid = isDateValid && isTimeValid;

    return (
        <DialogWithExpander
            headerArea={
                <>
                    <div className="bar-title">{getTitle(text) || "New Note"}</div>

                    <MenuDialogComponent items={[
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
