import { RenderResult, render } from "../functions/render.js";
import { shadow } from "../internals/shadow.js";
import { propify } from "../internals/propify.js";

type PropsType = Record<string, any> | null;

export function h(tagName: string, props: PropsType = null, ...children: RenderResult[]): RenderResult {
    /* Shadow Root: */
    if (tagName === "shadow") {
        // Return synthetic container for shadow root:
        return shadow(children);
    }

    /* Document Fragment: */
    else if (tagName === "fragment") {
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
            Object.keys(props).forEach(name => propify(element, name, props[name]));
        }

        // Append children, and return:
        render(children, element);
        return element;
    }
}