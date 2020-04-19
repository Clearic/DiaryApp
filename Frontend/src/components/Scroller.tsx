import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

const initialScrollOffset = 25000;
const marginTop = 50;
const itemMinHeight = 500;

export interface ScrollerProps<T> {
    readonly startIndex: number;
    readonly getItemData: (index: number) => T | undefined
    readonly renderItem: (itemData: T, index: number) => React.ReactElement;
    readonly load: (index: number) => void;
}

export const Scroller = <T extends {}>({ startIndex, getItemData, load, renderItem }: ScrollerProps<T>): React.ReactElement => {
    const componentRootRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(startIndex);
    const [maxItems, setMaxItems] = useState(3);
    const itemsPosRef = useRef<{ itemsTop: number, itemsBottom: number }>();
    const prevIndexRef = useRef(index);

    const loadIfNotLoaded = (i: number) => {
        if (!getItemData(i)) {
            load(i);
        }
    }

    const adjustItemsIndex = () => {
        if (itemsPosRef.current) {
            const { itemsTop, itemsBottom } = itemsPosRef.current;
            const viewTop = window.scrollY;
            const viewBottom = window.scrollY + window.innerHeight;

            if ((itemsBottom - itemsTop) - (viewBottom - viewTop) < itemMinHeight) {
                setIndex(x => x - 1);
                setMaxItems(x => x + 1);
            } else if (viewTop - itemsTop < 0) {
                setIndex(x => x - Math.ceil((itemsTop - viewTop) / itemMinHeight));
                
            } else if (itemsBottom - viewBottom < 0) {
                setIndex(x => x + Math.ceil((viewBottom - itemsBottom) / itemMinHeight));
            }
        }
    }

    useWindowScroll(adjustItemsIndex);

    // reposition items
    useLayoutEffect(() => {
        if (componentRootRef.current) {
            const firstChild = componentRootRef.current.firstElementChild as (HTMLElement | null);
            const lastChild = componentRootRef.current.lastElementChild as (HTMLElement | null);

            if (firstChild && lastChild) {
                if (!firstChild.style.top && !lastChild.style.top) { // init
                    positionElementsTopDown(initialScrollOffset - componentRootRef.current.offsetTop, componentRootRef.current);
                    window.scrollTo(0, initialScrollOffset - marginTop);
                    setTimeout(() => {
                        window.scrollTo(0, initialScrollOffset - marginTop);
                    }, 0);
                } else if (!firstChild.style.top) { // item added at the top
                    repositionElementsBottomUp(componentRootRef.current);
                } else if (!lastChild.style.top) { // item added at the bottom
                    repositionElementsTopDown(componentRootRef.current);
                } else { // no items are added, but height of some items might have changed
                    repositionElementsTopDown(componentRootRef.current);
                }
                itemsPosRef.current = {
                    itemsTop: firstChild.offsetTop,
                    itemsBottom: lastChild.offsetTop + lastChild.offsetHeight
                };
                adjustItemsIndex();
            }
        }
    });

    // Ensure new items loaded
    useEffect(() => {
        const prevIndex = prevIndexRef.current
        const indexDiff = index - prevIndex;

        if (-maxItems < indexDiff && indexDiff < 0) {
            for (let i = index; i < prevIndex; i++) {
                loadIfNotLoaded(i);
            }
        } else if (maxItems > indexDiff && indexDiff > 0) {
            for (let i = prevIndex + maxItems; i < index + maxItems; i++) {
                loadIfNotLoaded(i);
            }
        } else {
            for (let i = index; i < index + maxItems; i++) {
                loadIfNotLoaded(i);
            }
        }

        prevIndexRef.current = index;
    }, [index]);

    // skip null items and take not null items
    const items: React.ReactElement[] = [];
    let skippedItems = false;
    let droppedItems = false;
    for (let i = index; i < index + maxItems; i++) {
        const item = getItemData(i);
        if (item) {
            items.push(<div key={i} className="scroller-item">{renderItem(item, i)}</div>);
        } else if (items.length === 0) {
            skippedItems = true;
        } else {
            droppedItems = true;
            break;
        }
    }

    const [showTopLoader, showBottomLoader]
        = items.length === 0
            ? [false, false]
            : [skippedItems, droppedItems];

    return (
        <div className="scroller" ref={componentRootRef} style={{ minHeight: `${initialScrollOffset * 2}px` }}>
            {items.length === 0 && <div className="scroller-item scroller-item-loader" style={{ top: 0, bottom: 0 }}></div>}
            {showTopLoader && <div className="scroller-item scroller-item-loader" style={{ height: `${initialScrollOffset}px` }}></div>}
            {items}
            {showBottomLoader && <div className="scroller-item scroller-item-loader" style={{ bottom: 0 }}></div>}
        </div>
    );
}

const positionElementsTopDown = (offsetTop: number, container: HTMLElement): void => {
    let offset = offsetTop;
    for (let i = 0; i < container.children.length; i++) {
        const element = container.children[i] as HTMLElement;
        element.style.top = offset + "px";
        offset += element.offsetHeight;
    }
}

const repositionElementsTopDown = (container: HTMLElement): void => {
    const firstChild = container.firstElementChild as (HTMLElement | null);
    if (firstChild) {
        positionElementsTopDown(firstChild.offsetTop, container);
    }
}

const repositionElementsBottomUp = (container: HTMLElement): void => {
    const lastChild = container.lastElementChild as (HTMLElement | null);
    if (lastChild) {
        let offset = lastChild.offsetTop;
        for (let i = container.children.length - 2; i >= 0; i--) {
            const element = container.children[i] as HTMLElement;
            offset -= element.offsetHeight;
            element.style.top = offset + "px";
        }
    }
}

const useWindowScroll = (handleScroll: () => void) => {
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => { window.removeEventListener("scroll", handleScroll); }
    });
}