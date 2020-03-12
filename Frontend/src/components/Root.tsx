import * as React from "react";
import { MainBarComponent } from "./MainBar";
import { MonthListComponent } from "./MonthList";
import { DialogComponent } from "./Dialogs";

export function RootComponent() {
    return (
        <div>
            <MainBarComponent />
            <MonthListComponent />
            <DialogComponent />
        </div>
    );
}
