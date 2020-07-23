import { RenderResult, render } from "./render.js";
import { propify } from "../internals/propify.js";

type PropsType = Record<string, any> | null;

export function h(tagName: string, props: PropsType = null, ...children: RenderResult[]): RenderResult {
    /* Document Fragment: */
    if (tagName === "fragment") {
        // Initialize fragment:
        const fragment = document.createDocumentFragment();

        // Append children, and return:
        render(children, fragment);
        return fragment;
    }

    /* Standard Element: */
    else {
        // Create element:
        const element = document.createElement(tagName);

        // Add properties:
        if (props) {
            console.log(props);
            Object.keys(props).forEach(name => propify(element, name, props[name]));
        }

        // Append children, and return:
        render(children, element);
        return element;
    }
}