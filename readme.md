# WebElement

A light, Vue-inspired abstraction layer over custom elements.

## Example:

### Define:
```js
import { construct, html } from "web-element";

construct("say-hello", {
    render() {
        return html`<h1>
            Hello 
            <span class="ref-name">
                ${this.props.name}
            </span>
        </h1>`;
    }
});
```

### Use:
```html
<say-hello name="Raghav"></say-hello>
```

