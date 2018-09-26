import * as React from "react";
import { connect } from "react-redux";
import * as Actions from "../actions";
import * as Thunks from "../thunks";
import { ApplicationState, Note, DateTime, Dialog } from "../store";
import { isEmptyOrSpaces, getTitle } from "../utils";
import {
    dateToFromStr,
    timeToFromStr,
    parseFormDate,
    parseFormTime,
    isDayGreater,
    getCurrentDateTime,
    isDateTimeEqual
} from "../date";

interface MenuItem {
    title: string;
    action(): void;
}

interface MenuDialogProps {
    items: ReadonlyArray<MenuItem>;
}

interface MenuDialogState {
    menuVisible: boolean;
}

class MenuDialogComponent extends React.PureComponent<MenuDialogProps, MenuDialogState> {
    dropdown: undefined | HTMLDivElement;
    constructor(props: MenuDialogProps) {
        super(props);
        this.state = { menuVisible: false };
    }
    setRefDropdown = (d: HTMLDivElement) => {
        this.dropdown = d;
    }
    showMenu = () => {
        this.setState({ menuVisible: !this.state.menuVisible });

        if (!this.state.menuVisible)
            document.addEventListener("mousedown", this.hideMenu);
    }
    anyParent = (el: HTMLElement, pred: ((x: HTMLElement) => boolean)) => {
        let p: HTMLElement | null = el;
        while (p) {
            if (pred(p))
                return true;
            p = p.parentElement;
        }
        return false;
    }
    hideMenu = (e: any) => {
        if (!e || !this.anyParent(e.target, x => x === this.dropdown)) {
            this.setState({ menuVisible: false });
            document.removeEventListener("mousedown", this.hideMenu);
        }
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.hideMenu);
    }
    menuItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const index = e.currentTarget.getAttribute("data-index");
        if (!index)
            throw new Error(`Invalid data-index value ${index}`);

        const i = parseInt(index, 10);
        this.props.items[i].action();

        this.hideMenu(null);
    }
    render() {
        return (
            <div className="menu-dropdown" ref={this.setRefDropdown}>
                <button className="bar-button" onClick={this.showMenu}>⋯</button>
                { this.state.menuVisible &&
                    <div className="dropdown">
                        { this.props.items.map((x, i) =>
                            <a key={i}
                               data-index={i}
                               className="dropdown-item"
                               href="#"
                               onClick={this.menuItemClick}>
                               {x.title}
                            </a>)
                        }
                    </div>
                }
            </div>
        );
    }
}

interface BaseNoteDialogProps {
    dispatch(action: Actions.Action | Thunks.ThunkAction): Actions.Action;
}

interface BaseNoteDialogState {
    text: string;
    formVisible: boolean;
    date: string;
    time: string;
}

abstract class BaseNoteDialogComponent<P extends BaseNoteDialogProps, S extends BaseNoteDialogState>
    extends React.PureComponent<P, S> {
    textarea: undefined | HTMLTextAreaElement;
    constructor(props: P) {
        super(props);
        this.menuItems = [];
    }
    abstract save: () => void;
    abstract isDirty: () => boolean;
    abstract getTitle: () => string;
    menuItems: ReadonlyArray<MenuItem>;
    componentDidMount() {
        document.body.setAttribute("class", "no-scroll");
    }
    componentWillUnmount() {
        document.body.setAttribute("class", "");
    }
    handleSave = () => {
        this.save();
        this.props.dispatch(Actions.closeDialog());
    }
    handleClose = () => {
        this.props.dispatch(Actions.closeDialog());
    }
    handleTextChange = (el: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({text: el.currentTarget.value});
    }
    handleDateChange = (el: React.FormEvent<HTMLInputElement>) => {
        this.setState({date: el.currentTarget.value});
    }
    handleTimeChange = (el: React.FormEvent<HTMLInputElement>) => {
        this.setState({time: el.currentTarget.value});
    }
    setRefTextarea = (el: HTMLTextAreaElement) => {
        this.textarea = el;
    }
    showForm = () => {
        this.setState({formVisible: true});
    }
    hideForm = () => {
        this.setState({formVisible: false});
    }
    isDateValid = () => {
        try {
            const date = parseFormDate(this.state.date);
            return !isDayGreater(date, getCurrentDateTime());
        } catch (err) {
            return false;
        }
    }
    isTimeValid = () => {
        try {
            parseFormTime(this.state.time);
            return true;
        } catch (err) {
            return false;
        }
    }
    isFormValid = () => this.isDateValid() && this.isTimeValid();
    getDateTime = (): DateTime => {
        const date = parseFormDate(this.state.date);
        const time = parseFormTime(this.state.time);
        return {...date, ...time};
    }
    render() {
        return (
            <section className="dialog-back">
                <div className="dialog">
                    <div className="bar">
                        { this.state.formVisible ?
                            <button className="bar-button" onClick={this.hideForm}>
                                <span className="less-icon"></span>
                            </button>
                            :
                            <button className="bar-button" onClick={this.showForm}>
                                <span className="more-icon"></span>
                            </button>
                        }

                        <div className="bar-title">{this.getTitle()}</div>

                        <MenuDialogComponent items={this.menuItems} />

                        { this.isDirty() ?
                            <button className="bar-button" onClick={this.handleSave} disabled={!this.isFormValid()}>Save</button>
                            :
                            <button className="bar-button" onClick={this.handleClose}>Close</button>
                        }
                    </div>
                    { this.state.formVisible &&
                        <div className="dialog-form">
                            <div className="input-group">
                                <label htmlFor="date">Date</label>
                                <input
                                    name="date"
                                    type="date"
                                    className={this.isDateValid() ? "" : "error"}
                                    value={this.state.date}
                                    onChange={this.handleDateChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="time">Time</label>
                                <input
                                    name="time"
                                    type="time"
                                    className={this.isTimeValid() ? "" : "error"}
                                    value={this.state.time}
                                    onChange={this.handleTimeChange} />
                            </div>
                        </div>
                    }
                    <div className="content">
                        <textarea
                            ref={this.setRefTextarea}
                            value={this.state.text}
                            onChange={this.handleTextChange}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

interface CreateNoteDialogProps extends BaseNoteDialogProps {
    readonly date: DateTime;
}

class CreateNoteDialogComponenet extends BaseNoteDialogComponent<CreateNoteDialogProps, BaseNoteDialogState> {
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

interface EditNoteDialogProps extends BaseNoteDialogProps {
    readonly note: Note;
}

class EditNoteDialogComponenet extends BaseNoteDialogComponent<EditNoteDialogProps, BaseNoteDialogState> {
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

interface DialogProps {
    dispatch(action: Actions.Action): Actions.Action;
    dialog: Dialog;
}

function DialogComponent(props: DialogProps) {
    const {dialog, dispatch} = props;

    switch (dialog.type) {
        case "NoDialog":
            return <div />;
        case "CreateNoteDialog":
            return <CreateNoteDialogComponenet date={dialog.date} dispatch={dispatch} />;
        case "EditNoteDialog":
            return <EditNoteDialogComponenet note={dialog.note} dispatch={dispatch} />;
        default:
            const exhaustiveCheck: never = dialog;
            return exhaustiveCheck;
    }
}

const mapStateToProps = (state: ApplicationState) => {
    return {dialog: state.dialog};
}

export const DialogContainer = connect(mapStateToProps)(DialogComponent);
