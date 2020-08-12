import { RenderResult } from "../functions/render.js";
import { CastableType, PropType, JSONPropType, PropProxy } from "./prop-proxy.js";

export interface ICustomElement<Store> extends HTMLElement {
    $(selector: string): Element | Element[];
	store?: Store,
	props: PropProxy
} 

/* Type of a watcher function */
export type WatcherCallback<Store> = (
	this: ICustomElement<Store>,
    value: (PropType | JSONPropType)
) => void;

/* Type of an event handler */
export type EventHandler<Store, EventType extends Event = Event> = (
	this: ICustomElement<Store>,
	e: EventType
) => void;

/* Main configuration object */
export interface IPorpoiseConfig<Store> {
	/* Store */
	store?: (this: ICustomElement<{}>) => Store;

	/* Cast properties */
	castedProps?: Record<string, CastableType>;

	/* Lifecycle hooks */
	created?(this: ICustomElement<Store>): void; // Called in "constructor" right after "super()".
	mounted?(this: ICustomElement<Store>): void; // Called in "connectedCallback".
	removed?(this: ICustomElement<Store>): void; // Called in "disconnectedCallback".
	adopted?(this: ICustomElement<Store>): void; // Called in "adoptedCallback".

	/* Watch attributes */
	watch?: Record<string, WatcherCallback<Store>>; // Called in "attributeChangedCallback".

	/* Render function returns children */
	render?(this: ICustomElement<Store>): RenderResult;

	/* Template & compilation */
	compiler?: (c: ICustomElement<any>) => (s: string[]) => RenderResult;
	template?: string;

	/* Event handlers */
	events?: Record<string, EventHandler<Store>>;

	/* Mount shadow root */
	shadow?: boolean;

	/* Styling */
	css?: string | ((this: ICustomElement<Store>) => string);
}