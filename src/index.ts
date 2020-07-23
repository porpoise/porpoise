// ES5 code-compat polyfill:
import "./internals/es5-adapter.js";

// Element Render functions:
export * from "./functions/h.js";
export * from "./functions/render.js";

// The real deal (builds the components):
export * from "./functions/construct.js";

// Export types:
export * from "./internals/api.js";
