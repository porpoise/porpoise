import { RenderResult, render, ValidParent } from "./render.js";
import { propify } from "../internals/propify.js";

type HProps = Record<string, any> | null;

export function h(tagName: string, props: HProps = null, ...children: RenderResult[]): ValidParent {
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