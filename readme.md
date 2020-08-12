![Porpoise](./logo.png)

> ### A light, Vue-inspired abstraction layer over custom elements.

# Install:
`npm i porpoise`

# The classic counter, in 5 steps:

1. Initialize a component with the template compiler:
```js
import { construct, compiler } from "porpoise";
construct("cool-counter", {
    compiler
});
```

2. Render the markup:
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

3. Setup the `count` property:
```js 
import { construct, compiler } from "porpoise";
construct("cool-counter", {
    compiler,

    template: `
        <h1>
            Count:
            <span :innerText="this.props.count" />
        </h1>
        <button>Increase</button>
        <button>Decrease</button>
    `,

    castedProps: { count: "number" } // Auto-casts the attribute "count" to a number.
});
```

4. Create and bind event listeners:
```js
import { construct, compiler } from "porpoise";
construct("cool-counter", {
    compiler,

    template: `
        <h1>
            Count:
            <span :innerText="this.props.count" />
        </h1>
        <button onClick="this.store.increase">Increase</button>
        <button onClick="this.store.decrease">Decrease</button>
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

5. Voila! Now you're ready to use your element!

```html
<!-- In your HTML -->
<cool-counter count="1">
</cool-counter>
```