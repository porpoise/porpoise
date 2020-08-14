![Porpoise](./logo.png)

> ### A light, Vue-inspired abstraction layer over custom elements.

# Install:
NPM (recommended, both global & ESM): `npm i porpoise`

CDN:
- Global (recommended): https://cdn.jsdelivr.net/npm/porpoise@latest/lib/index.js
- ESM (only for in-browser testing): https://cdn.jsdelivr.net/npm/porpoise@latest/lib/esm/index.js

# The classic counter, in 5 steps:

### Initialize a component with the template compiler
```js
import { construct, compiler } from "porpoise";
construct("cool-counter", {
    compiler
});
```

### Render the markup:
```js 
import { construct, compiler } from "porpoise";
construct("cool-counter", {
    compiler,

    template: `
        <h1>
            Count:
            <span />
        </h1>
        <button>Increase</button>
        <button>Decrease</button>
    `,
});
```

### Setup the `count` property
```js 
import { construct, compiler } from "porpoise";
construct("cool-counter", {
    compiler,

    template: `
        <h1>
            Count:
            <span :p-text="this.props.count" />
        </h1>
        <button>Increase</button>
        <button>Decrease</button>
    `,

    castedProps: { count: "number" } // Auto-casts the attribute "count" to a number.
});
```

### Create and bind event listeners
```js
import { construct, compiler } from "porpoise";
construct("cool-counter", {
    compiler,

    template: `
        <h1>
            Count:
            <span :p-text="this.props.count" />
        </h1>
        <button @click="this.store.increase">Increase</button>
        <button @click="this.store.decrease">Decrease</button>
    `,

    castedProps: { count: "number" },

    // The store holds component-specific data:
    store() {
        return {
            increase() { this.props.count++; },
            decrease() { this.props.count--; }
        }
    },
});
```

### Voila! Now you're ready to use your element!

```html
<!-- In your HTML -->
<cool-counter count="1">
</cool-counter>
```