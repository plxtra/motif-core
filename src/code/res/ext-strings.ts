/** @public */
export interface ExtStringId {
    handle: ExtStringId.Handle;
    index: ExtStringId.Index;
}

/** @public */
export namespace ExtStringId {
    export type Handle = number;
    export type Index = number;

    export function create(handle: Handle, index: Index): ExtStringId {
        return {
            handle,
            index,
        };
    }

    export function createUndefinableIndex(handle: Handle, index: Index | undefined): ExtStringId | undefined {
        if (index === undefined) {
            return undefined;
        } else {
            return create(handle, index);
        }
    }
}

/** @public */
export const extStrings: string[][] = new Array<string[]>(10);

/** @public */
export namespace ExtStrings {
    export function setExtensionStrings(extensionHandle: number, strings: string[]) {
        if (extensionHandle > extStrings.length) {
            extStrings.length = extensionHandle * 2;
        }
        extStrings[extensionHandle] = strings;
    }

    export function clearExtensionStrings(extensionHandle: number) {
        extStrings[extensionHandle] = [];
    }
}
