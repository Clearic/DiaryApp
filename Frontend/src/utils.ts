export function isEmptyOrSpaces(str: string) {
    const regex = /^\s*$/;
    return regex.test(str);
}

export function getTitle(text: string): string | undefined {
    let title = "";

    const index = text.indexOf("\n");
    if (index === -1) {
        title = text;
    } else {
        title = text.substr(0, index);
    }

    if (isEmptyOrSpaces(title)) {
        return undefined;
    }
    return title;
}
