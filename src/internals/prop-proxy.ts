type PropType = string | number | boolean;
type JSONPropType = Record<string, PropType> | PropType[];
export type CastableType = "string" | "number" | "boolean" | "json";

export type PropProxy = Record<string, PropType | JSONPropType | undefined>;

/* Wrap around DOM attribute manipulation */
export function propProxy(element: HTMLElement, castedProps: Record<string, CastableType>) {
    return new Proxy({}, {
        get(target, prop: string) {
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
    let returnValue: PropType | JSONPropType | undefined;
    switch (type) {
        case "string":
            returnValue = value;
            break;
        case "number": 
            returnValue = Number(value);
            break;
        case "boolean":
            returnValue = value === "true" ?
                true : false;
            break;
        case "json":
            returnValue = proxiedJSONProp(element, prop, value);
            break;
    }
    return returnValue;
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
            console.log(callback);
            callback();
            return true;
        }
    })
}