import { RenderResult } from "../functions/render.js";

export interface ICustomElement extends HTMLElement {
    $(selector: string): Element | Element[];
} 

/* Type of a watcher function */
export type WatcherCallback = (
	this: ICustomElement,
	newValue: string,
	oldValue: string
) => void;

/* Type of an event handler */
export type EventHandler<EventType extends Event = Event> = (
	this: ICustomElement,
	e: EventType
) => void;

/* Main configuration object */
export interface IWebElementConfig {
	/* Lifecycle hooks */
	created?(this: ICustomElement): void; // Called in "constructor" right after "super()".
	mounted?(this: ICustomElement): void; // Called in "connectedCallback".
	removed?(this: ICustomElement): void; // Called in "disconnectedCallback".
	adopted?(this: ICustomElement): void; // Called in "adoptedCallback".

	/* Watch attributes */
	watch?: Record<string, WatcherCallback>; // Called in "attributeChangedCallback".

	/* Render function returns children */
	render(this: ICustomElement): RenderResult;

	/* Event handlers */
	events: Record<string, EventHandler>;
}