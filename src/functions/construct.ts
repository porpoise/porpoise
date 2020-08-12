import { IPorpoiseConfig, ICustomElement } from "../internals/api.js";
import { render } from "../functions/render.js";
import { PropProxy, propProxy, castValue } from "../internals/prop-proxy.js";

/* Construct a custom element: */
export function construct<Store>(tagName: string, config: IPorpoiseConfig<Store>): void {
	const getTypeOfProp = (p: string) =>
		(config.castedProps ? config.castedProps[p] : "string") ||
		"string";
	
	const dependencies: Record<string, Set<Function>> = Object.create(null);

	// Component Class
	const Component = class extends HTMLElement
		implements ICustomElement<Store> {
		store?: Store;
		props: PropProxy;

		static get observedAttributes() {
			return Object.keys(config.watch || Object.create(null));
		}

		get renderTarget() {
			return config.shadow ? this.shadowRoot || this : this;
		}

		constructor() {
			// Required super call.
			super();

			// Attribute proxier:
			this.props = propProxy(this, config.castedProps || {}, dependencies);

			// Call "created" lifecycle hook:
			config.created && config.created.call(this);

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

			// Append children:
			config.render &&
				render(config.render.bind(this)(), this.renderTarget);

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

		connectedCallback() {
			// Call "mounted" lifecycle hook:
			config.mounted && config.mounted.call(this);
		}

		disconnectedCallback() {
			// Call "removed" lifecycle hook:
			config.removed && config.removed.call(this);
		}

		adoptedCallback() {
			// Call "adopted" lifecycle hook:
			config.adopted && config.adopted.call(this);
		}

		attributeChangedCallback(prop: string, oldValue: string, newValue: string) {
			if (dependencies[prop]) {
				console.log(dependencies[prop]);
				dependencies[prop].forEach(fn => fn());
			} else {
				console.log(dependencies);
			}

			// Call watcher function for changed attribute:
			if (config.watch) {
				config.watch[prop].call(
					this,
					castValue(
						this,
						prop,
						newValue,
						getTypeOfProp(prop)
					) as string,
					castValue(
						this,
						prop,
						oldValue,
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