/* Return type of render function (children) */
export type RenderResult = any;
export type ValidParent = HTMLElement | ShadowRoot;

export function render(child: RenderResult, parent: ValidParent) {
    // Recursive it
    if (Array.isArray(child)) child.forEach(c => render(c, parent));

    // Already a Node:
    else if (child instanceof Node) {
        parent.appendChild(child);
    }
    // Otherwise resolve to Text Node:
    else {
        parent.appendChild(document.createTextNode(child.toString()));
    }
}