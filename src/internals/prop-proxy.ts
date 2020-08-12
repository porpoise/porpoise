import { getCurrentFunction } from "./effect.js";

// Keep element data for prop binding:
type ReactiveNodeDescriptor =
    { element: HTMLElement, property: string } |
    { textNode: Text } |
    null;
let currentNode: ReactiveNodeDescriptor = null;

export type PropType = string | number | boolean;
export type JSONPropType = Record<string, PropType> | PropType[];
export type CastableType = "string" | "number" | "boolean" | "json";
export type PropProxy = Record<string, PropType | JSONPropType | undefined>;

/* Wrap around DOM attribute manipulation */
export function propProxy(element: HTMLElement, castedProps: Record<string, CastableType>, dependencies: Record<string, Set<Function>>): PropProxy {

    return new Proxy({}, {
        get(target, prop: string) {
            const currentFunction = getCurrentFunction();
            if (currentFunction) {
                dependencies[prop] = dependencies[prop] || new Set();
                dependencies[prop].add(currentFunction);
            }

            const rawValue = element.getAttribute(prop);
            // If attribute exists:
            if (rawValue !== null) {
                // If it must be casted:
                if (castedProps[prop]) return castValue(element, prop, rawValue, castedProps[prop]);

                // Return as a string:
                else return rawValue;
            }
            // Doesn't exist:
            else return undefined;
        },
        set(target, prop: string, value: PropType | JSONPropType) {
            if (castedProps[prop]) {
                element.setAttribute(prop, uncastValue(value));
            }
            else {
                element.setAttribute(prop, value as string);
            }
            return true;
        }
    });
}

/* Cast to required type: */
export function castValue(element: HTMLElement, prop: string, value: string, type: CastableType): PropType | JSONPropType | undefined {
    switch (type) {
        case "string":
            return value;
        case "number": 
            return Number(value);
        case "boolean":
            return value === "true" ?
                true : false;
        case "json":
            return proxiedJSONProp(element, prop, value);
    }
}
/* Serialize back to string */
export function uncastValue(value: PropType | JSONPropType): string {
    if (typeof value === "object") return JSON.stringify(value);
    else return value.toString();
}

/* Return a reactive object: */
function proxiedJSONProp(element: HTMLElement, prop: string, raw: string): JSONPropType | undefined {
    try {
        const jsonObj = JSON.parse(raw);
        return nestedReactiveObject(jsonObj, () => element.setAttribute(prop, uncastValue(jsonObj)));
    }
    catch (e) { return undefined; }
}

/* Recursively make a object recursive deeply */
function nestedReactiveObject(data: JSONPropType, callback: Function): JSONPropType {
    return new Proxy(data, {
        get(target: any, prop: string) {
            if (typeof target[prop] === "object") return nestedReactiveObject(target[prop], callback);
            else return target[prop];
        },
        set(target: any, prop: string, value: any) {
            target[prop] = value;
            callback();
            return true;
        }
    })
}