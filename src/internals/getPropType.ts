import { IPorpoiseConfig } from "./api";
import { PropType, CastableType } from "./prop-proxy";

export function getPropType(prop: string, config: IPorpoiseConfig<any>): CastableType {
    if (config.castedProps && prop in config.castedProps) {
        return config.castedProps[prop];
    }

    // Default to string:
    else return "string";
}