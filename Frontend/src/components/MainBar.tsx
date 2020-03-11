import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../types";
import * as Actions from "../actions";
import { getMonthName, getDayOfWeekName } from "../date";

interface MainBarProps {
    readonly requests: ReadonlyArray<Actions.Action>;
    dispatch(action: Actions.Action): Actions.Action;
}

class MainBarComponent extends React.PureComponent<MainBarProps, never> {
    newNote = () => {
        this.props.dispatch(Actions.newNote());
    }
    scrollToCurrentMonth = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.props.dispatch(Actions.scrollToCurrentWeek());
    }
    render() {
        const today = new Date();
        const day = today.getDate();
        const year = today.getFullYear();
        const monthName = getMonthName(today.getMonth() + 1);
        const dayName = getDayOfWeekName(today.getDay());
        return (
            <div className="bar bar-main">
                <button className="bar-button" onClick={this.newNote}>New</button>
                <div className="bar-title bar-title--center">
                    <a onClick={this.scrollToCurrentMonth}>
                        {dayName}, {day} {monthName} {year}
                    </a>
                </div>
                <div className="bar-requests">
                    {this.props.requests.map((x, i) => <div key={i}>{this.getRequestSymbol(x)}</div>)}
                </div>
            </div>
        );
    }
    getRequestSymbol(request: Actions.Action) {
        switch (request.type) {
            case "LoadNotesRequest":
                return "↓";
            case "CreateNoteRequest":
                return "↑";
            case "UpdateNoteRequest":
                return "↑";
            case "DeleteNoteRequest":
                return "↑";
        }
        return "";
    }
}

function mapStateToProps(state: ApplicationState) {
    return {requests: state.requests};
}

export const MainBarContainer = connect(mapStateToProps)(MainBarComponent);
