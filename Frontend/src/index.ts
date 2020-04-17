import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "./configureStore";
import { loadNotesSuccess } from "./actions";
import { RootComponent } from "./components/Root";
import { Note, YearMonth } from "./types";
import * as DT from "./date-time";

const store = configureStore();

interface InitData {
    readonly month: YearMonth;
    readonly notes: Note[];
}

declare const initData: InitData | undefined;

if (typeof initData !== "undefined") {
    for (let i = 0; i < initData.notes.length; i++) {
        const note = initData.notes[i] as any;
        note.date = DT.parse(note.date);
    }
    store.dispatch(loadNotesSuccess(0, initData.month, initData.notes));
}

const mount = document.querySelector("#app")

ReactDOM.render(
    React.createElement(Provider, {store},
        React.createElement(RootComponent)
    ),
    mount
);
