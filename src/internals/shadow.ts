import { RenderResult } from "../functions/render.js";

export interface IShadow {
    readonly isShadowRootDescriptor: true;
    readonly children: RenderResult[];
}

export function shadow(children: RenderResult[]): IShadow {
    const descriptor: IShadow = {
        isShadowRootDescriptor: true,
        children
    };

    Object.seal(descriptor);
    Object.freeze(descriptor);

    return descriptor;
}