import { CommaText, EnumInfoOutOfOrderError, isArrayEqualUniquely } from '@pbkware/js-utils';
import { StringId, Strings } from '../../res/internal-api';
import { FieldDataTypeId } from '../../sys/internal-api';

export interface DataIvemAlternateCodes {
    [key: string]: string | undefined;
    ticker?: string;
    gics?: string;
    isin?: string;
    ric?: string;
    base?: string;
    short?: string;
    long?: string;
    uid?: string;
}

export namespace DataIvemAlternateCodes {
    export function isEqual(left: DataIvemAlternateCodes, right: DataIvemAlternateCodes) {
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (!isArrayEqualUniquely(leftKeys, rightKeys)) {
            return false;
        } else {
            const count = leftKeys.length;
            for (let i = 0; i < count; i++) {
                const key = leftKeys[i];
                if (left[key] !== right[key]) {
                    return false;
                }
            }
            return true;
        }
    }

    export function isUndefinableEqual(left: DataIvemAlternateCodes | undefined, right: DataIvemAlternateCodes | undefined) {
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

    export function toDisplay(alternateCodes: DataIvemAlternateCodes) {
        const keyValueDisplays: string[] = [];
        for (const [key, value] of Object.entries(alternateCodes)) {
            const keyValueDisplay = key + '=' + (value ?? '');
            keyValueDisplays.push(keyValueDisplay);
        }
        return CommaText.fromStringArray(keyValueDisplays);
    }

    export namespace Field {
        export const enum Id {
            Base,
            Ticker,
            Gics,
            Isin,
            Ric,
            Short,
            Long,
            Uid,
        }

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof Id]: Info };

        const infosObject: InfosObject = {
            Base: {
                id: Id.Base,
                name: 'Base',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemAlternateCodeDisplay_Base,
                headingId: StringId.DataIvemAlternateCodeHeading_Base,
            },
            Ticker: {
                id: Id.Ticker,
                name: 'Ticker',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemAlternateCodeDisplay_Ticker,
                headingId: StringId.DataIvemAlternateCodeHeading_Ticker,
            },
            Gics: {
                id: Id.Gics,
                name: 'Gics',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemAlternateCodeDisplay_Gics,
                headingId: StringId.DataIvemAlternateCodeHeading_Gics,
            },
            Isin: {
                id: Id.Isin,
                name: 'Isin',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemAlternateCodeDisplay_Isin,
                headingId: StringId.DataIvemAlternateCodeHeading_Isin,
            },
            Ric: {
                id: Id.Ric,
                name: 'Ric',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemAlternateCodeDisplay_Ric,
                headingId: StringId.DataIvemAlternateCodeHeading_Ric,
            },
            Short: {
                id: Id.Short,
                name: 'Short',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemAlternateCodeDisplay_Short,
                headingId: StringId.DataIvemAlternateCodeHeading_Short,
            },
            Long: {
                id: Id.Long,
                name: 'Long',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemAlternateCodeDisplay_Long,
                headingId: StringId.DataIvemAlternateCodeHeading_Long,
            },
            Uid: {
                id: Id.Uid,
                name: 'Uid',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemAlternateCodeDisplay_Uid,
                headingId: StringId.DataIvemAlternateCodeHeading_Uid,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export const allNames = new Array<string>(idCount);

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (infos[id].id !== id as Id) {
                    throw new EnumInfoOutOfOrderError('DataIvemAlteranteCodes.Field', id, infos[id].name);
                } else {
                    allNames[id] = idToName(id);
                }
            }
        }

        export function idToName(id: Id): string {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: Id) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToHeadingId(id: Id) {
            return infos[id].headingId;
        }

        export function idToHeading(id: Id) {
            return Strings[idToHeadingId(id)];
        }
    }
}

export namespace DataIvemAlternateCodesModule {
    export function initialiseStatic() {
        DataIvemAlternateCodes.Field.initialise();
    }
}
