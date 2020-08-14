import { RenderResult, ValidParent } from "./render";
import { ICustomElement } from "../internals/api.js";
import { h } from "./h.js";
import htm from "../internals/htm.js";

const input = /* html */`
    <h1 :title="this.props.title"></h1>
`;

type TemplateCompilerFactory = (
    component: ICustomElement<any>,
    tagName: string,
    props: Record<string, string>,
    ...children: RenderResult[]
) => ValidParent;

const compilerFactory: TemplateCompilerFactory = (component, tagName, props, ...children) => {
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

export const compiler = (component: ICustomElement<any>) => htm.bind(
    (
        tagName: string,
        props: Record<string, string>,
        ...children: RenderResult[]
    ) =>
        compilerFactory(component, tagName, props, ...children)
);