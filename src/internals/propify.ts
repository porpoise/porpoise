const domProps = ["innerHTML", "innerText", "textContent"]

export function propify(element: HTMLElement, prop: string, value: any): void {
    // Element dom properties:
    if (domProps.indexOf(prop) !== -1) {
        //@ts-ignore
        element[prop] = value;
    }

    // Event handlers:
    else if (prop.startsWith("on") && typeof value === "function") {
        element.addEventListener(
            prop.replace("on", "").toLowerCase(),
            value
        );
    }

    // Set as normal attribute:
    else {
        element.setAttribute(prop, value);
    }
}