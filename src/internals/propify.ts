import { effect } from "./effect.js";
import { uncastValue } from "./prop-proxy.js";
import { kebabify } from "./kebabify.js";

const isEventProp = (prop: string) => prop.startsWith("@") || prop.startsWith("on");
const convertPropToEvent = (prop: string) => prop.replace("@", "").replace("on", "");

export function propify(element: HTMLElement, rawProp: string, value: any): void {
    const prop = kebabify(rawProp).trim();

    // Event handlers:
    if (isEventProp(prop) && typeof value === "function") {
        element.addEventListener(
            convertPropToEvent(prop),
            value
        );
    }
        
    // Dynamic props:
    else if (!isEventProp(prop) && typeof value === "function") {
        effect(() => propify(element, prop, value(element)));
    } 

    // Inner text rendering:
    else if (prop === "p-text") {
        element.textContent = value;
    }
        
    // Unsafe innerHTML rendering:
    else if (prop === "p-unsafe-html") {
        element.innerHTML = value;
    }

    // Set as normal attribute:
    else {
        element.setAttribute(prop, uncastValue(value));
    }
}