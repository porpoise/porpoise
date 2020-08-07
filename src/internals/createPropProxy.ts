type PropType = string | number | boolean;
type JSONSerializable = Record<string, PropType> | PropType[];
export type CastableType = "string" | "number" | "boolean" | "array" | "json";

export type PropProxy = Record<string, PropType | JSONSerializable | undefined>;

export function createPropProxy(element: HTMLElement, castedProps: Record<string, CastableType>) {
    return new Proxy({}, {
        get(target, prop: string) {
            const rawValue = element.getAttribute(prop);
            // If attribute exists:
            if (rawValue !== null) {
                // If it must be casted:
                if (castedProps[prop]) return castValue(rawValue, castedProps[prop]);

                // Return as a string:
                else return rawValue;
            }
            // Doesn't exist:
            else return undefined;
        },
        set(target, prop: string, value: PropType | JSONSerializable) {
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

export function castValue(value: string, type: CastableType): PropType | JSONSerializable | undefined {
    let returnValue: PropType | JSONSerializable | undefined;
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
            returnValue = caughtJSONParse(value);
            break;
    }
    return returnValue;
}

function caughtJSONParse(raw: string): JSONSerializable | undefined {
    try {
        return JSON.parse(raw);
    }
    catch (e) { return undefined; }
}

export function uncastValue(value: PropType | JSONSerializable): string {
    if (typeof value === "object") return JSON.stringify(value);
    else return value.toString();
}