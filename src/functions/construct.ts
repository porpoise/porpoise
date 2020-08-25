import { IPorpoiseConfig, ICustomElement } from "../internals/api.js";
import { render } from "../functions/render.js";
import { PropProxy, propProxy, castValue } from "../internals/prop-proxy.js";
import { attributeObserver } from "../internals/attribute-observer.js";

/* Construct a custom element: */
export function construct<Store>(tagName: string, config: IPorpoiseConfig<Store>): void {
	const getTypeOfProp = (p: string) =>
		(config.castedProps ? config.castedProps[p] : "string") ||
		"string";

	// Component Class
	const Component = class extends HTMLElement
		implements ICustomElement<Store> {
		store?: Store;

		//@ts-ignore
		props: PropProxy;

		// Private properties:
		"[[firstRender]]": boolean = true;
		"[[dependencies]]": Record<string, Set<Function>> = Object.create(null);

		get renderTarget() {
			return config.shadow ? this.shadowRoot || this : this;
		}

		constructor() {
			// Required super call.
			super();

			// Call "created" lifecycle hook:
			config.beforeMounted && config.beforeMounted.call(this);
		}

		connectedCallback() {
			// On first render: 
			if (this["[[firstRender]]"]) {
				this["[[firstRender]]"] = false;

				// Attribute proxier:
				this.props = propProxy(this, config.castedProps || {}, this["[[dependencies]]"]);

				// Generate "store":
				if (config.store) {
					const unboundStore = config.store.call(this);
					for (const prop in unboundStore) {
						if (typeof unboundStore[prop] === "function") {
							unboundStore[prop] = ((unboundStore[
								prop
							] as unknown) as Function).bind(this);
						}
					}
					this.store = unboundStore;
				}

				// Register event handlers:
				if (config.events) {
					for (const eventName in config.events) {
						this.addEventListener(
							eventName,
							config.events[eventName].bind(this)
						);
					}
				}

				// Create shadow root if necessary:
				config.shadow && this.attachShadow({ mode: "open" });

				// append children:
				if (config.render) render(config.render.call(this), this.renderTarget);
				else if (config.template && config.compiler)
					render(config.compiler(this)([config.template]), this.renderTarget);
				
				// If Shadow DOM, then apply CSS:
				if (config.css && config.shadow) {
					const style = document.createElement("style");
					style.textContent =
						typeof config.css === "string"
							? config.css
							: config.css.call(this);
					render(style, this.renderTarget);
				}
			}

			// Call "mounted" lifecycle hook:
			config.mounted && config.mounted.call(this);

			// Setup attribute change watching:
			attributeObserver(this, this.whenAttributeChanged.bind(this));
		}

		disconnectedCallback() {
			// Call "removed" lifecycle hook:
			config.removed && config.removed.call(this);
		}

		adoptedCallback() {
			// Call "adopted" lifecycle hook:
			config.adopted && config.adopted.call(this);
		}

		whenAttributeChanged(prop: string, newValue: string) {
			if (this["[[dependencies]]"][prop]) {
				this["[[dependencies]]"][prop].forEach(fn => fn());
			}

			// Call watcher function for changed attribute:
			if (config.watch && config.watch[prop]) {
				config.watch[prop].call(
					this,
					castValue(
						this,
						prop,
						newValue,
						getTypeOfProp(prop)
					) as string
				);
			}
		}

		$(selector: string) {
			const nodes =
				this.renderTarget.querySelectorAll(selector) || [];
			if (nodes.length === 1) return nodes[0];
			else return Array.from(nodes);
		}
	};

	// Add CSS to global DOM:
	if (!config.shadow && config.css) {
		const style = document.createElement("style");
		style.textContent = config.css as string;
		render(style, document.head);
	}

	// Register element:
	customElements.define(tagName, Component);
}