// ES5 code-compat polyfill:
import "./internals/es5-adapter.js";

// Element Render functions:
export { h } from "./functions/h.js";
export { render } from "./functions/render.js";

// The real deal (builds the components):
export { construct } from "./functions/construct.js";

// Export types:
export * from "./internals/api.js";

// Template compiler
export { compiler } from "./functions/compiler.js";

// Register components:
import "./components/p-show.js";
