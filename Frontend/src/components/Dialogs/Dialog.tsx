import * as React from "react";

export function Dialog(props: React.PropsWithChildren<{}>) {
    React.useEffect(() => {
        document.body.setAttribute("class", "no-scroll");
        return () => {
            document.body.setAttribute("class", "");
        };
    }, []);

    return (
        <section className="dialog-back">
            <div className="dialog">
                {props.children}
            </div>
        </section>
    );
}
