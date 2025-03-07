import { isArrayEqualUniquely } from '@pbkware/js-utils';

export class DataIvemAttributes {
    private _unrecognisedAttributes: DataIvemAttributes.UnrecognisedAttributes = [];

    constructor(readonly zenithExchangeCode: string) { }

    get unrecognisedAttributes() { return this._unrecognisedAttributes; }
    get unrecognisedCount() { return this._unrecognisedAttributes.length; }

    addUnrecognised(key: string, value: string) {
        const attribute: DataIvemAttributes.UnrecognisedAttribute = {
            key,
            value,
        };
        this._unrecognisedAttributes.push(attribute);
    }

    isEqualTo(other: DataIvemAttributes): boolean {
        return isArrayEqualUniquely(this._unrecognisedAttributes, other._unrecognisedAttributes);
    }
}

export namespace DataIvemAttributes {
    export interface UnrecognisedAttribute {
        key: string;
        value: string;
    }

    export type UnrecognisedAttributes = UnrecognisedAttribute[];

    export function isEqual(left: DataIvemAttributes, right: DataIvemAttributes) {
        if (left.zenithExchangeCode !== right.zenithExchangeCode) {
            return false;
        } else {
            return left.isEqualTo(right);
        }
    }

    export function isUndefinableEqual(left: DataIvemAttributes | undefined, right: DataIvemAttributes | undefined) {
        if (left === undefined) {
            return right === undefined;
        } else {
            if (right === undefined) {
                return false;
            } else {
                return isEqual(left, right);
            }
        }
    }
}
