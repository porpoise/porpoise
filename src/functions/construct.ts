import { RenderResult } from "../functions/render";

/* Type of a watcher function */
export type WatcherCallback = (
    this: HTMLElement,
    newValue: string,
    oldValue: string
) => void;

/* Main configuration object */
export interface IWebElementConfig {
    /* Lifecycle hooks */
    created?(this: HTMLElement): void; // Called in "constructor" right after "super()".
    mounted?(this: HTMLElement): void; // Called in "connectedCallback".
    removed?(this: HTMLElement): void; // Called in "disconnectedCallback".
    adopted(this: HTMLElement): void; // Called in "adoptedCallback".

    /* Watch attributes */
    watch?: Record<string, WatcherCallback>; // Called in "attributeChangedCallback".

    /* Render function returns children */
    render(this: HTMLElement): RenderResult;
}

/* Construct a custom element: */
export function construct(tagName: string, config: IWebElementConfig): void {

}