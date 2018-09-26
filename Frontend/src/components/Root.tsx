import * as React from "react";
import { MainBarContainer } from "./MainBar";
import { MonthListContainer } from "./MonthList";
import { DialogContainer } from "./Dialog";

export function RootComponent() {
    return (
        <div>
            <MainBarContainer />
            <MonthListContainer />
            <DialogContainer />
        </div>
    );
}
