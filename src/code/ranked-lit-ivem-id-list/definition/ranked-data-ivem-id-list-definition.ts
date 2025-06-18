import { EnumInfoOutOfOrderError, Err, JsonElement, Ok, Result } from '@pbkware/js-utils';
import { StringId, Strings } from '../../res';
import { ErrorCode, JsonElementErr } from '../../sys';

export abstract class RankedDataIvemIdListDefinition {
    constructor(readonly typeId: RankedDataIvemIdListDefinition.TypeId) {
    }

    saveToJson(element: JsonElement) {
        element.setString(RankedDataIvemIdListDefinition.typeIdJsonName, RankedDataIvemIdListDefinition.Type.idToJsonValue(this.typeId));
    }
}

export namespace RankedDataIvemIdListDefinition {
    export const enum TypeId {
        DataIvemIdArray,
        WatchmakerListId,
        ScanId,
        DataIvemIdExecuteScan,
    }

    export namespace Type {
        export type Id = TypeId;

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly jsonValue: string;
            readonly abbreviationId: StringId;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof TypeId]: Info };

        const infosObject: InfosObject = {
            DataIvemIdArray: {
                id: TypeId.DataIvemIdArray,
                name: 'DataIvemIdArray',
                jsonValue: 'DataIvemIdArray', // was 'Explicit',
                abbreviationId: StringId.RankedDataIvemIdListAbbreviation_DataIvemIdArray,
                displayId: StringId.RankedDataIvemIdListDisplay_DataIvemIdArray,
            },
            WatchmakerListId: {
                id: TypeId.WatchmakerListId,
                name: 'WatchmakerListId',
                jsonValue: 'WatchmakerListId',
                abbreviationId: StringId.RankedDataIvemIdListAbbreviation_WatchmakerListId,
                displayId: StringId.RankedDataIvemIdListDisplay_WatchmakerListId,
            },
            ScanId: {
                id: TypeId.ScanId,
                name: 'Scan',
                jsonValue: 'Scan',
                abbreviationId: StringId.RankedDataIvemIdListAbbreviation_ScanId,
                displayId: StringId.RankedDataIvemIdListDisplay_ScanId,
            },
            DataIvemIdExecuteScan: {
                id: TypeId.DataIvemIdExecuteScan,
                name: 'DataIvemIdExecuteScan',
                jsonValue: 'DataIvemIdExecuteScan',
                abbreviationId: StringId.RankedDataIvemIdListAbbreviation_DataIvemIdExecuteScan,
                displayId: StringId.RankedDataIvemIdListDisplay_DataIvemIdExecuteScan,
            },
        }

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                const info = infos[id];
                if (id as Id !== info.id) {
                    throw new EnumInfoOutOfOrderError('RankedDataIvemIdListDefinition.TypeId', id, idToName(id));
                }
            }
        }

        export function idToName(id: TypeId) {
            return infos[id].name;
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id) {
            return Strings[idToDisplayId(id)];
        }

        export function idToAbbreviationId(id: Id) {
            return infos[id].abbreviationId;
        }

        export function idToAbbreviation(id: Id) {
            return Strings[idToAbbreviationId(id)];
        }

        export function idToJsonValue(id: Id) {
            return infos[id].jsonValue;
        }

        export function tryJsonValueToId(value: string) {
            for (const info of infos) {
                if (info.jsonValue === value) {
                    return info.id;
                }
            }
            return undefined;
        }
    }

    export const typeIdJsonName = 'typeId';

    export function tryGetTypeIdFromJson(element: JsonElement): Result<TypeId> {
        const typeIdResult = element.tryGetString(typeIdJsonName);
        if (typeIdResult.isErr()) {
            return JsonElementErr.createOuter(typeIdResult.error, ErrorCode.DataIvemIdListDefinition_TryGetTypeIdFromJson);
        } else {
            const typeId = Type.tryJsonValueToId(typeIdResult.value);
            if (typeId === undefined) {
                return new Err(ErrorCode.DataIvemIdListDefinition_TypeIdUnknown);
            } else {
                return new Ok(typeId);
            }
        }
    }
}

/** @internal */
export namespace RankedDataIvemIdListDefinitionModule {
    export function initialiseStatic() {
        RankedDataIvemIdListDefinition.Type.initialise();
    }
}
