/* Return type of render function (children) */
export type RenderResult = any;

export function render(child: RenderResult, parent: DocumentFragment | HTMLElement) {
    // Already a Node:
    if (child instanceof Node) {
        parent.appendChild(child);
    }
    // Otherwise resolve to TextNode:
    else {
        parent.appendChild(document.createTextNode(child.toString()));
    }
}