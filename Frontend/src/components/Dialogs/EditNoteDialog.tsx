import * as Actions from "../../actions";
import * as Thunks from "../../thunks";
import { Note } from "../../store";
import { getTitle } from "../../utils";
import { dateToFromStr, timeToFromStr, isDateTimeEqual } from "../../date";
import { BaseNoteDialogComponent, BaseNoteDialogProps, BaseNoteDialogState } from "./BaseNoteDialog";

export interface EditNoteDialogProps extends BaseNoteDialogProps {
    readonly note: Note;
}

export class EditNoteDialogComponenet extends BaseNoteDialogComponent<EditNoteDialogProps, BaseNoteDialogState> {
    constructor(props: EditNoteDialogProps) {
        super(props);
        this.state = {
            text: props.note.text,
            formVisible: false,
            date: dateToFromStr(props.note.date),
            time: timeToFromStr(props.note.date)
        };
    }
    menuItems = [
        { title: "Delete", action: () => {
                if (confirm("Are you sure you want to delete?")) {
                    this.props.dispatch(Actions.closeDialog());
                    this.props.dispatch(Thunks.deleteNote(this.props.note));
                }
            }
        },
        { title: "Close", action: () => this.props.dispatch(Actions.closeDialog()) }
    ];
    isDirty = () =>
        this.state.text !== this.props.note.text ||
        !isDateTimeEqual(this.props.note.date, this.getDateTime())
    getTitle = () => getTitle(this.state.text) || "";
    save = () => {
        const date = this.getDateTime();
        const note: Note = {
            id: this.props.note.id,
            date,
            text: this.state.text
        };
        this.props.dispatch(Thunks.updateNote(note, this.props.note.date));
    }
}