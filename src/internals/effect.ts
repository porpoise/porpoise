let currentFunction: null | Function = null;

export function effect(callback: Function) {
    currentFunction = callback;
    currentFunction();
    currentFunction = null;
}

export const getCurrentFunction = () => currentFunction;