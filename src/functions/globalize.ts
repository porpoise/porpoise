export const globals: Record<string, any> = Object.create(null);

type GlobalSignature = () => any;

export function globalize(name: string, objectToExpose: GlobalSignature) {
    Object.defineProperty(globals, name, {
        get() { return objectToExpose.call(null); }
    });
}