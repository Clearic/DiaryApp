import * as React from "react";
import { connect } from "react-redux";
import * as Actions from "../../actions";
import { ApplicationState, Dialog } from "../../types";
import { CreateNoteDialogComponenet } from "./CreateNoteDialog";
import { EditNoteDialogComponenet } from "./EditNoteDialog";

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
