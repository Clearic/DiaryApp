import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ApplicationState } from "../types";
import * as Actions from "../actions";
import { getMonthName, getDayOfWeekName } from "../date";

export const MainBarComponent: React.FC = () => {
    const dispatch = useDispatch();
    const requests = useSelector((state: ApplicationState) => state.requests);
    const newNote = () => {
        dispatch(Actions.newNote());
    }
    const scrollToCurrentMonth = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        dispatch(Actions.scrollToCurrentWeek());
    }

    const today = new Date();
    const day = today.getDate();
    const year = today.getFullYear();
    const monthName = getMonthName(today.getMonth() + 1);
    const dayName = getDayOfWeekName(today.getDay());
    return (
        <div className="bar bar-main">
            <button className="bar-button" onClick={newNote}>New</button>
            <div className="bar-title bar-title--center">
                <a onClick={scrollToCurrentMonth}>
                    {dayName}, {day} {monthName} {year}
                </a>
            </div>
            <div className="bar-requests">
                {requests.map((x, i) => <div key={i}>{getRequestSymbol(x)}</div>)}
            </div>
        </div>
    );
}

const getRequestSymbol = (request: Actions.Action) => {
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
