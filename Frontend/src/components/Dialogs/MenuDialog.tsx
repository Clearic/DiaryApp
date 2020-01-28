import * as React from "react";

export interface MenuItem {
    title: string;
    action(): void;
}

export interface MenuDialogProps {
    items: ReadonlyArray<MenuItem>;
}

export interface MenuDialogState {
    menuVisible: boolean;
}

export class MenuDialogComponent extends React.PureComponent<MenuDialogProps, MenuDialogState> {
    dropdown: undefined | HTMLDivElement;
    constructor(props: MenuDialogProps) {
        super(props);
        this.state = { menuVisible: false };
    }
    setRefDropdown = (d: HTMLDivElement) => {
        this.dropdown = d;
    }
    showMenu = () => {
        this.setState({ menuVisible: !this.state.menuVisible });

        if (!this.state.menuVisible)
            document.addEventListener("mousedown", this.hideMenu);
    }
    anyParent = (el: HTMLElement, pred: ((x: HTMLElement) => boolean)) => {
        let p: HTMLElement | null = el;
        while (p) {
            if (pred(p))
                return true;
            p = p.parentElement;
        }
        return false;
    }
    hideMenu = (e: any) => {
        if (!e || !this.anyParent(e.target, x => x === this.dropdown)) {
            this.setState({ menuVisible: false });
            document.removeEventListener("mousedown", this.hideMenu);
        }
    }
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.hideMenu);
    }
    menuItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const index = e.currentTarget.getAttribute("data-index");
        if (!index)
            throw new Error(`Invalid data-index value ${index}`);

        const i = parseInt(index, 10);
        this.props.items[i].action();

        this.hideMenu(null);
    }
    render() {
        return (
            <div className="menu-dropdown" ref={this.setRefDropdown}>
                <button className="bar-button" onClick={this.showMenu}>⋯</button>
                { this.state.menuVisible &&
                    <div className="dropdown">
                        { this.props.items.map((x, i) =>
                            <a key={i}
                               data-index={i}
                               className="dropdown-item"
                               href="#"
                               onClick={this.menuItemClick}>
                               {x.title}
                            </a>)
                        }
                    </div>
                }
            </div>
        );
    }
}