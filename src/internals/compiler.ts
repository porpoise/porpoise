import { RenderResult, ValidParent } from "../functions/render.js";
import { ICustomElement } from "./api.js";
import { h } from "../functions/h.js";
import htmlParser from "./html-parser.js";

type TemplateFactory = (
    component: ICustomElement<any>,
    tagName: string,
    props: Record<string, string>,
    ...children: RenderResult[]
) => ValidParent;

const compilerFactory: TemplateFactory = (component, tagName, props, ...children) => {
    const compiledProps: Record<string, any> = Object.create(null);

    for (const name in props) {
        // Reactive property:
        if (name.startsWith(":")) {
            compiledProps[name.replace(":", "")] = new Function(`return (${props[name]});`).bind(component);
        }
        // Static property:
        else if (name.startsWith(";")) {
            compiledProps[name.replace(";", "")] = new Function(`return (${props[name]});`).call(component);
        }
        // Event handling:
        else if (name.startsWith("@") || name.startsWith("on")) {
            compiledProps[name] = new Function(`return (${props[name]});`).call(component);
        }
        // Normal string property:  
        else {
            compiledProps[name] = props[name];
        }
    }

    return h(tagName, compiledProps, ...children);
}

export const compiler = (component: ICustomElement<any>) => htmlParser.bind(
    (
        tagName: string,
        props: Record<string, string>,
        ...children: RenderResult[]
    ) =>
        compilerFactory(component, tagName, props, ...children)
);
