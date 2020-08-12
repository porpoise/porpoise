![Porpoise](./logo.png)

> ### A light, Vue-inspired abstraction layer over custom elements.

## Example:

### Install:
`npm i porpoise`

### Define:
```js
import { construct, html } from "porpoise"; // NPM package

construct("say-hello", {
    store() {
        return {
            changeValue() {
                this.props.name = prompt("Name?", this.props.name);
            }
        };
    },

    render() {
        return html`
            <h1 textContent=${_ => `Hello, ${this.props.name}`} />
            <button onClick=${this.store.changeValue}>
                Change Name
            </button>
        `;
    }
});
```

### Use:
```html
<say-hello name="Porpoise"></say-hello>
```

