import { effect } from "./effect.js";

const domProps = ["innerHTML", "innerText", "textContent"]

export function propify(element: HTMLElement, prop: string, value: any): void {
    // Event handlers:
    if (prop.startsWith("on") && typeof value === "function") {
        element.addEventListener(
            prop.replace("on", "").toLowerCase(),
            value
        );
    }
        
    // Dynamic props:
    else if (typeof value === "function") {
        effect(() => propify(element, prop, value(element)));
    }
        
    // Element dom properties:
    else if (domProps.indexOf(prop) !== -1) {
        //@ts-ignore
        element[prop] = value;
    }

    // Set as normal attribute:
    else {
        element.setAttribute(prop, value);
    }
}