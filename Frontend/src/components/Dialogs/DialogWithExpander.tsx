import * as React from "react";
import { Dialog } from "./Dialog";

export interface DialogWithExpanderProps {
    headerArea: React.ReactNode;
    expanderArea: React.ReactNode;
    contentArea: React.ReactNode;
}

export const DialogWithExpander: React.FC<DialogWithExpanderProps> = (props) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <Dialog>
            <div className="bar">
                {expanded &&
                    <button className="bar-button" onClick={() => setExpanded(false)}>
                        <span className="less-icon"></span>
                    </button>
                }
                {!expanded &&
                    <button className="bar-button" onClick={() => setExpanded(true)}>
                        <span className="more-icon"></span>
                    </button>
                }
                {props.headerArea}
            </div>
            {expanded &&
                <div className="dialog-form">
                    {props.expanderArea}
                </div>
            }
            {props.contentArea}
        </Dialog>
    );
}