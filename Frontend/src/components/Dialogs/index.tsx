import * as React from "react";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../types";
import { CreateNoteDialogComponenet } from "./CreateNoteDialog";
import { EditNoteDialogComponenet } from "./EditNoteDialog";

export const DialogComponent: React.FC = () => {
    const dialog = useSelector((state: ApplicationState) => state.dialog);

    switch (dialog.type) {
        case "NoDialog":
            return <div />;
        case "CreateNoteDialog":
            return <CreateNoteDialogComponenet date={dialog.date} />;
        case "EditNoteDialog":
            return <EditNoteDialogComponenet note={dialog.note} />;
        default:
            const exhaustiveCheck: never = dialog;
            return exhaustiveCheck;
    }
}
