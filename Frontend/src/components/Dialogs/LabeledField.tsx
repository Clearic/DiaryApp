import * as React from "react";

export interface LabeledFieldProps {
    id: string;
    label: string;
    type: string;
    value: string;
    isValid: boolean;
    onChange: (x: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LabeledField: React.FC<LabeledFieldProps> = (props) => {
    return (
        <div className="input-group">
            <label htmlFor={props.id}>{props.label}</label>
            <input
                id={props.id}
                type={props.type}
                className={props.isValid ? "" : "error"}
                value={props.value}
                onChange={props.onChange} />
        </div>
    );
}