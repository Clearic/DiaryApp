import * as React from "react";
import { connect } from "react-redux";
import { MonthComponent } from "./Month";
import { ApplicationState, Month, MonthNotes } from "../store";
import * as Actions from "../actions";
import * as Thunks from "../thunks";
import {
    getCurrentMonth,
    getPrevMonth,
    getNextMonth,
    getMonthKey,
    isMonthGreater,
    isMonthLess,
    getWeekOfMonth
} from "../date";

type Dispatch1 = (action: Actions.Action) => Actions.Action;
interface Dispatch2 {
    (action: Actions.Action): Actions.Action
}

interface MonthListComponentProps {
    readonly notes: MonthNotes;
    readonly scrollToCurrentMonth: number;
    dispatch(action: Actions.Action | Thunks.ThunkAction): Actions.Action;
}

interface MonthListComponentState {
    month: Month;
}

const scrollOffset = 50000;

export class MonthListComponent extends React.PureComponent<MonthListComponentProps, MonthListComponentState> {
    scrollWrap: undefined | HTMLDivElement;
    scroll: undefined | HTMLDivElement;
    constructor(props: MonthListComponentProps) {
        super(props);
        this.state = {month: getCurrentMonth()};
    }
    setRef1 = (div: HTMLDivElement) => {
        this.scrollWrap = div;
    }
    setRef2 = (div: HTMLDivElement) => {
        this.scroll = div;
    }
    loadNotesIfNotLoaded = (month: Month) => {
        if (!this.props.notes.hasOwnProperty(getMonthKey(month))) {
            this.props.dispatch(Thunks.loadNotes(month));
        }
    }
    handleScroll = () => {
        if (!this.scroll || !this.scrollWrap || !this.scroll.firstChild || !this.scroll.lastChild)
            return;
        const itemsTop = (this.scroll.firstChild as HTMLElement).offsetTop;
        const scrollTop = this.scrollWrap.scrollTop;
        const lastChild = this.scroll.lastChild as HTMLElement;
        const itemsBottom = lastChild.offsetTop + lastChild.offsetHeight;
        const scrollBottom = this.scrollWrap.scrollTop + this.scrollWrap.clientHeight;

        if (itemsBottom < scrollBottom) {
            this.setState({month: getNextMonth(this.state.month)});
        } else if (itemsTop > scrollTop) {
            const prevMonth = getPrevMonth(this.state.month);
            this.setState({month: prevMonth});
            this.loadNotesIfNotLoaded(prevMonth);
        }
    }
    updateItemsPositions() {
        if (this.scroll) {
            for (let i = 1; i < this.scroll.children.length; i++) {
                const prev = this.scroll.children[i - 1] as HTMLElement;
                const item = this.scroll.children[i] as HTMLElement;
                item.style.top = `${prev.offsetTop + prev.offsetHeight}px`;
            }
        }
    }
    updateItemsPositionsReverse() {
        if (this.scroll) {
            for (let i = this.scroll.children.length - 2; i >= 0; i--) {
                const item = this.scroll.children[i] as HTMLElement;
                const next = this.scroll.children[i + 1] as HTMLElement;
                item.style.top = `${next.offsetTop - item.offsetHeight}px`;
            }
        }
    }
    scrollToCurrentWeek() {
        if (this.scroll && this.scrollWrap) {
            const firstChild = (this.scroll.firstChild as HTMLElement);
            const week = getWeekOfMonth(getCurrentMonth(), new Date().getDate());
            const weekOffset = (firstChild.children[1].children[week - 1] as HTMLElement).offsetTop;
            if (week === 1)
                this.scrollWrap.scrollTop = scrollOffset;
            else
                this.scrollWrap.scrollTop = scrollOffset + weekOffset - 25;
        }
    }
    componentDidMount() {
        if (this.scroll && this.scrollWrap) {
            (this.scroll.firstChild as HTMLElement).style.top = `${scrollOffset}px`;
            this.updateItemsPositions();
            this.scrollToCurrentWeek();
            this.scrollWrap.addEventListener("scroll", this.handleScroll);
        }
    }
    componentWillUnmount() {
        if (this.scrollWrap) {
            this.scrollWrap.removeEventListener("scroll", this.handleScroll);
        }
    }
    componentDidUpdate(prevProps: MonthListComponentProps, prevState: MonthListComponentState) {
        if (this.scroll && this.scrollWrap) {
            if (this.props.scrollToCurrentMonth !== prevProps.scrollToCurrentMonth) {
                const firstChild = (this.scroll.firstChild as HTMLElement);
                firstChild.style.top = `${scrollOffset}px`;
                this.updateItemsPositions();
                this.scrollToCurrentWeek();
            } else if (isMonthGreater(this.state.month, prevState.month)) {
                const prev = this.scroll.children[this.scroll.children.length - 2] as HTMLElement;
                const item = this.scroll.children[this.scroll.children.length - 1] as HTMLElement;
                item.style.top = `${prev.offsetTop + prev.offsetHeight}px`;
            } else if (isMonthLess(this.state.month, prevState.month)) {
                const item = this.scroll.children[0] as HTMLElement;
                const next = this.scroll.children[1] as HTMLElement;
                item.style.top = `${next.offsetTop - item.offsetHeight}px`;
            } else {
                this.updateItemsPositionsReverse();
            }
        }
    }
    componentWillReceiveProps(nextProps: MonthListComponentProps) {
        if (this.scroll && this.scrollWrap) {
            if (this.props.scrollToCurrentMonth !== nextProps.scrollToCurrentMonth) {
                this.setState({month: getCurrentMonth()});
                this.scrollWrap.scrollTop = scrollOffset;
            }
        }
    }
    render() {
        const {notes, dispatch} = this.props;
        const currentMonth = getCurrentMonth();
        const renderMonth = (month: Month) => {
            if (this.props.notes.hasOwnProperty(getMonthKey(month)) ||
                isMonthGreater(month, currentMonth)) {
                return <MonthComponent
                    {...month}
                    notes={notes}
                    dispatch={dispatch}
                    className="scroll-item"
                    key={getMonthKey(month)} />;
            }

            return <div
                key={getMonthKey(month)}
                style={{height: 2000, backgroundColor: "silver"}}
                className="scroll-item">
                    Loading...
                </div>;
        };
        const month1 = this.state.month;
        const month2 = getNextMonth(month1);
        const month3 = getNextMonth(month2);
        const months = [
            renderMonth(month1),
            renderMonth(month2),
            renderMonth(month3)
        ];

        return (
            <div ref={this.setRef1} className="month-list scroll-wrap">
                <div ref={this.setRef2} className="scroll">
                    {months}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        notes: state.notes,
        scrollToCurrentMonth: state.scrollToCurrentMonth
    };
}

export const MonthListContainer = connect(mapStateToProps)(MonthListComponent);
