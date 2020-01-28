import * as Actions from "../../actions";
import * as Thunks from "../../thunks";
import { DateTime } from "../../store";
import { isEmptyOrSpaces, getTitle } from "../../utils";
import {
    dateToFromStr,
    timeToFromStr} from "../../date";
import { BaseNoteDialogComponent, BaseNoteDialogProps, BaseNoteDialogState } from "./BaseNoteDialog";

export interface CreateNoteDialogProps extends BaseNoteDialogProps {
    readonly date: DateTime;
}

export class CreateNoteDialogComponenet extends BaseNoteDialogComponent<CreateNoteDialogProps, BaseNoteDialogState> {
    constructor(props: CreateNoteDialogProps) {
        super(props);
        this.state = {
            text: "",
            formVisible: false,
            date: dateToFromStr(props.date),
            time: timeToFromStr(props.date)
        };
    }
    menuItems = [
        { title: "Close", action: () => this.props.dispatch(Actions.closeDialog()) }
    ];
    isDirty = () => !isEmptyOrSpaces(this.state.text);
    getTitle = () => getTitle(this.state.text) || "New Note";
    save = () => {
        const date = this.getDateTime();
        this.props.dispatch(Thunks.createNote(date, this.state.text));
    }
    componentDidMount() {
        super.componentDidMount();
        //this.textarea.focus();
    }
}