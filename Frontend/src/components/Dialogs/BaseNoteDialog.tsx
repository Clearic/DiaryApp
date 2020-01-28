import * as React from "react";
import * as Actions from "../../actions";
import * as Thunks from "../../thunks";
import { DateTime } from "../../store";
import {
    parseFormDate,
    parseFormTime,
    isDayGreater,
    getCurrentDateTime} from "../../date";
import { MenuDialogComponent, MenuItem } from "./MenuDialog";

export interface BaseNoteDialogProps {
    dispatch(action: Actions.Action | Thunks.ThunkAction): Actions.Action;
}

export interface BaseNoteDialogState {
    text: string;
    formVisible: boolean;
    date: string;
    time: string;
}

export abstract class BaseNoteDialogComponent<P extends BaseNoteDialogProps, S extends BaseNoteDialogState>
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