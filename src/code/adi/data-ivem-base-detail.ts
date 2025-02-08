import { StringId, Strings } from '../res/internal-api';
import { EnumInfoOutOfOrderError, FieldDataTypeId, MultiEvent } from '../sys/internal-api';
import {
    DataIvemAlternateCodes,
    IvemClassId,
    PublisherSubscriptionDataTypeId
} from './common/internal-api';
import { DataMarket, Exchange, TradingMarket } from './markets/internal-api';
import { ReadonlyDataIvemIdRecord } from './readonly-data-ivem-id-record';
import { DataIvemId } from './symbol-id/internal-api';

export interface DataIvemBaseDetail extends ReadonlyDataIvemIdRecord {
    readonly dataIvemId: DataIvemId;
    readonly full: boolean;
    readonly key: DataIvemId;
    readonly code: string | undefined;
    readonly market: DataMarket | undefined;
    readonly ivemClassId: IvemClassId | undefined;
    readonly subscriptionDataTypeIds: readonly PublisherSubscriptionDataTypeId[] | undefined;
    readonly tradingMarkets: readonly TradingMarket[] | undefined;
    readonly name: string | undefined;
    readonly exchange: Exchange | undefined;
    readonly alternateCodes: DataIvemAlternateCodes | undefined;

    subscribeBaseChangeEvent: (handler: DataIvemBaseDetail.ChangeEventHandler) => MultiEvent.SubscriptionId;
    unsubscribeBaseChangeEvent: (subscriptionId: MultiEvent.SubscriptionId) => void;
}

export namespace DataIvemBaseDetail {
    export type ChangeEventHandler = (this: void, changedFieldIds: Field.Id[]) => void;

    export namespace Field {
        export const enum Id {
            Id,
            Code,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            Market,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            IvemClassId,
            SubscriptionDataTypeIds,
            TradingMarkets,
            Name,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            Exchange,
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
            Id: {
                id: Id.Id,
                name: 'Id',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.BaseDataIvemDetailDisplay_Id,
                headingId: StringId.BaseDataIvemDetailHeading_Id,
            },
            Code: {
                id: Id.Code,
                name: 'Code',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BaseDataIvemDetailDisplay_Code,
                headingId: StringId.BaseDataIvemDetailHeading_Code,
            },
            Market: {
                id: Id.Market,
                name: 'Market',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BaseDataIvemDetailDisplay_Market,
                headingId: StringId.BaseDataIvemDetailHeading_Market,
            },
            IvemClassId: {
                id: Id.IvemClassId,
                name: 'IvemClassId',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BaseDataIvemDetailDisplay_IvemClassId,
                headingId: StringId.BaseDataIvemDetailHeading_IvemClassId,
            },
            SubscriptionDataTypeIds: {
                id: Id.SubscriptionDataTypeIds,
                name: 'SubscriptionDataTypeIds',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BaseDataIvemDetailDisplay_SubscriptionDataTypeIds,
                headingId: StringId.BaseDataIvemDetailHeading_SubscriptionDataTypeIds,
            },
            TradingMarkets: {
                id: Id.TradingMarkets,
                name: 'TradingMarkets',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BaseDataIvemDetailDisplay_TradingMarkets,
                headingId: StringId.BaseDataIvemDetailHeading_TradingMarkets,
            },
            Name: {
                id: Id.Name,
                name: 'Name',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BaseDataIvemDetailDisplay_Name,
                headingId: StringId.BaseDataIvemDetailHeading_Name,
            },
            Exchange: {
                id: Id.Exchange,
                name: 'Exchange',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BaseDataIvemDetailDisplay_Exchange,
                headingId: StringId.BaseDataIvemDetailHeading_Exchange,
            },
        } as const;

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export const allNames = new Array<string>(idCount);

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (infos[id].id !== id as Id) {
                    throw new EnumInfoOutOfOrderError('DataIvemDetail.Field', id, infos[id].name);
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

    export type Key = DataIvemId;

    export namespace Key {
        export const fieldCount = 3;
    }
}

export namespace DataIvemBaseDetailModule {
    export function initialiseStatic() {
        DataIvemBaseDetail.Field.initialise();
    }
}
