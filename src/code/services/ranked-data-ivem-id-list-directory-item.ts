import { EnumInfoOutOfOrderError, Integer, LockOpenListItem, MultiEvent } from '@pbkware/js-utils';
import { StringId, Strings } from '../res';
import { CorrectnessRecord, CorrectnessSettableListItem, FieldDataTypeId } from '../sys';

export interface RankedDataIvemIdListDirectoryItem extends LockOpenListItem<RankedDataIvemIdListDirectoryItem>, CorrectnessSettableListItem, CorrectnessRecord {
    readonly directoryItemTypeId: RankedDataIvemIdListDirectoryItem.TypeId;
    readonly id: string;
    readonly: boolean;
    name: string;
    readonly upperCaseName: string;
    description: string | undefined;
    readonly upperCaseDescription: string | undefined;

    subscribeDirectoryItemChangedEvent(handler: RankedDataIvemIdListDirectoryItem.ChangedEventHandler): MultiEvent.SubscriptionId;
    unsubscribeDirectoryItemChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void;
}

export namespace RankedDataIvemIdListDirectoryItem {
    export type ChangedEventHandler = (this: void, FieldIds: FieldId[]) => void;

    export const enum TypeId {
        WatchmakerList,
        Scan,
    }

    export namespace Type {
        export type Id = TypeId;

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof TypeId]: Info };

        const infosObject: InfosObject = {
            WatchmakerList: {
                id: TypeId.WatchmakerList,
                name: 'WatchmakerList',
                displayId: StringId.RankedDataIvemIdListDirectoryItem_TypeId_WatchmakerList,
            },
            Scan: {
                id: TypeId.Scan,
                name: 'Scan',
                displayId: StringId.RankedDataIvemIdListDirectoryItem_TypeId_Scan,
            },
        };

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as TypeId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('SI85598', outOfOrderIdx, outOfOrderIdx.toString());
            }
        }

        export function idToName(id: Id) {
            return infos[id].name;
        }

        export function idToDisplayId(id: Id): StringId {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id): string {
            return Strings[idToDisplayId(id)];
        }
    }

    export const enum FieldId {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        TypeId,
        Id,
        Readonly,
        Name,
        Description,
    }

    export namespace Field {
        export type Id = FieldId;

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };

        const infosObject: InfosObject = {
            TypeId: {
                id: FieldId.TypeId,
                name: 'TypeId',
                dataTypeId: FieldDataTypeId.Enumeration,
                headingId: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_TypeId,
            },
            Id: {
                id: FieldId.Id,
                name: 'Id',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_Id,
            },
            Readonly: {
                id: FieldId.Readonly,
                name: 'Readonly',
                dataTypeId: FieldDataTypeId.Boolean,
                headingId: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_Readonly,
            },
            Name: {
                id: FieldId.Name,
                name: 'Name',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_Name,
            },
            Description: {
                id: FieldId.Description,
                name: 'Description',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.RankedDataIvemIdListDirectoryItemFieldHeading_Description,
            },
        } as const;

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: number) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('RankedDataIvemIdListDirectoryItem.FieldId', outOfOrderIdx, idToName(outOfOrderIdx));
            }
        }

        export function idToName(id: Id) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: Id) {
            return infos[id].dataTypeId;
        }

        export function idToHeadingId(id: Id) {
            return infos[id].headingId;
        }

        export function idToHeading(id: Id) {
            return Strings[idToHeadingId(id)];
        }
    }

    export function createMapKey(item: RankedDataIvemIdListDirectoryItem) {
        return `${item.name}|${item.id}`;
    }
}

export namespace RankedDataIvemIdListDirectoryItemModule {
    export function initialiseStatic() {
        RankedDataIvemIdListDirectoryItem.Type.initialise();
        RankedDataIvemIdListDirectoryItem.Field.initialise();
    }
}
