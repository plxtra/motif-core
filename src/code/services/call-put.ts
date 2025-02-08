import { DataIvemId, DataMarket, ExerciseTypeId, IvemId } from '../adi/internal-api';
import { StringId, Strings } from '../res/internal-api';
import { EnumInfoOutOfOrderError, FieldDataTypeId, Integer, MapKey, SourceTzOffsetDate, SysDecimal } from '../sys/internal-api';

export class CallPut {
    readonly mapKey: MapKey;

    constructor(
        readonly exercisePrice: SysDecimal,
        readonly expiryDate: SourceTzOffsetDate,
        readonly market: DataMarket,
        readonly contractMultiplier: SysDecimal,
        readonly exerciseTypeId: ExerciseTypeId,
        readonly underlyingIvemId: IvemId | undefined,
        readonly underlyingIsIndex: boolean | undefined,
        public callDataIvemId: DataIvemId | undefined,
        public putDataIvemId: DataIvemId | undefined,
    ){
        this.mapKey = CallPut.generateMapKey(this.exercisePrice, this.expiryDate, this.market.zenithCode);
    }

    // createKey(): CallPut.Key {
    //     return new CallPut.Key(this.exercisePrice, this.expiryDate, this.market);
    // }

    // matchesKey(key: CallPut.Key): boolean {
    //     return isDecimalEqual(key.exercisePrice, this.exercisePrice) &&
    //         key.expiryDate === this.expiryDate &&
    //         key.litId === this.market;
    // }

    // generateMapKey(): MapKey {
    //     return CallPut.Key.toString(this.exercisePrice, this.expiryDate, this.litId);
    // }
}

export namespace CallPut {
    export const enum FieldId {
        ExercisePrice,
        ExpiryDate,
        Market,
        CallDataIvemId,
        PutDataIvemId,
        ContractMultiplier,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        ExerciseTypeId,
        UnderlyingIvemId,
        UnderlyingIsIndex,
    }

    export namespace Field {
        export type Id = CallPut.FieldId;
        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfoObject = { [id in keyof typeof FieldId]: Info };

        const infoObject: InfoObject = {
            ExercisePrice: {
                id: FieldId.ExercisePrice,
                name: 'ExercisePrice',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.CallPutFieldDisplay_ExercisePrice,
                headingId: StringId.CallPutFieldHeading_ExercisePrice,
            },
            ExpiryDate: {
                id: FieldId.ExpiryDate,
                name: 'ExpiryDate',
                dataTypeId: FieldDataTypeId.Date,
                displayId: StringId.CallPutFieldDisplay_ExpiryDate,
                headingId: StringId.CallPutFieldHeading_ExpiryDate,
            },
            Market: {
                id: FieldId.Market,
                name: 'LitId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.CallPutFieldDisplay_LitId,
                headingId: StringId.CallPutFieldHeading_LitId,
            },
            CallDataIvemId: {
                id: FieldId.CallDataIvemId,
                name: 'CallDataIvemId',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.CallPutFieldDisplay_CallDataIvemId,
                headingId: StringId.CallPutFieldHeading_CallDataIvemId,
            },
            PutDataIvemId: {
                id: FieldId.PutDataIvemId,
                name: 'PutDataIvemId',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.CallPutFieldDisplay_PutDataIvemId,
                headingId: StringId.CallPutFieldHeading_PutDataIvemId,
            },
            ContractMultiplier: {
                id: FieldId.ContractMultiplier,
                name: 'ContractMultiplier',
                dataTypeId: FieldDataTypeId.Number,
                displayId: StringId.CallPutFieldDisplay_ContractMultiplier,
                headingId: StringId.CallPutFieldHeading_ContractMultiplier,
            },
            ExerciseTypeId: {
                id: FieldId.ExerciseTypeId,
                name: 'ExerciseTypeId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.CallPutFieldDisplay_ExerciseTypeId,
                headingId: StringId.CallPutFieldHeading_ExerciseTypeId,
            },
            UnderlyingIvemId: {
                id: FieldId.UnderlyingIvemId,
                name: 'UnderlyingIvemId',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.CallPutFieldDisplay_UnderlyingIvemId,
                headingId: StringId.CallPutFieldHeading_UnderlyingIvemId,
            },
            UnderlyingIsIndex: {
                id: FieldId.UnderlyingIsIndex,
                name: 'UnderlyingIsIndex',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.CallPutFieldDisplay_UnderlyingIsIndex,
                headingId: StringId.CallPutFieldHeading_UnderlyingIsIndex,
            },
        };

        export const count = Object.keys(infoObject).length;
        const infos = Object.values(infoObject);

        export function idToName(id: Id) {
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

        export function initialiseStaticField() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('CPFISF977532', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }
    }

    export function generateMapKey(exercisePrice: SysDecimal, expiryDate: SourceTzOffsetDate, marketZenithCode: string): MapKey {
        return `${exercisePrice.toString()}|${expiryDate.utcMidnight.getTime()}|${marketZenithCode}`;
    }

    // export class Key {
    //     static readonly JsonTag_ExercisePrice = 'exercisePrice';
    //     static readonly JsonTag_ExpiryDate = 'expiryDate';
    //     static readonly JsonTag_LitId = 'litId';

    //     private _mapKey: MapKey | undefined;

    //     constructor(public exercisePrice: SysDecimal, public expiryDate: Date, public litId: MarketId) { }

    //     get mapKey(): MapKey {
    //         if (this._mapKey === undefined) {
    //             this._mapKey = Key.toString(this.exercisePrice, this.expiryDate, this.litId);
    //         }
    //         return this._mapKey;
    //     }

    //     static createNull() {
    //         // will not match any valid CallPut
    //         return new Key(nullDecimal, nullDate, MarketId.AsxBookBuild);
    //     }

    //     assign(other: Key) {
    //         this.exercisePrice = other.exercisePrice;
    //         this.expiryDate = other.expiryDate;
    //         this.litId = other.litId;
    //     }

    //     // saveToJson(element: JsonElement) {
    //     //     element.setDecimal(Key.JsonTag_ExercisePrice, this.exercisePrice);
    //     //     element.setDate(Key.JsonTag_ExpiryDate, this.expiryDate);
    //     //     element.setString(Key.JsonTag_LitId, MarketInfo.idToJsonValue(this.litId));
    //     // }
    // }

    // export namespace Key {
    //     export function toString(exercisePrice: SysDecimal, expiryDate: Date, litId: MarketId): string {
    //         return `${exercisePrice.toString()}|${expiryDate.getTime()}|${MarketInfo.idToJsonValue(litId)}`;
    //     }

    //     export function isEqual(left: Key, right: Key) {
    //         return left.exercisePrice === right.exercisePrice &&
    //             left.expiryDate === right.expiryDate &&
    //             left.litId === right.litId;
    //     }

    //     // export function tryCreateFromJson(element: JsonElement) {
    //     //     const context = 'CallPut.Key.tryCreateFromJson';
    //     //     const exercisePrice = element.tryGetDecimal(Key.JsonTag_ExercisePrice, context);
    //     //     if (exercisePrice === undefined) {
    //     //         return 'Undefined ExercisePrice';
    //     //     } else {
    //     //         const expiryDate = element.tryGetDate(Key.JsonTag_ExpiryDate, context);
    //     //         if (expiryDate === undefined) {
    //     //             return 'Undefined ExpiryDate';
    //     //         } else {
    //     //             const litIdJson = element.tryGetString(Key.JsonTag_LitId, context);
    //     //             if (litIdJson === undefined) {
    //     //                 return 'Undefined LitId';
    //     //             } else {
    //     //                 const litId = MarketInfo.tryJsonValueToId(litIdJson);
    //     //                 if (litId === undefined) {
    //     //                     return `Unknown LitId: ${litIdJson}`;
    //     //                 } else {
    //     //                     return new Key(exercisePrice, expiryDate, litId);
    //     //                 }
    //     //             }
    //     //         }
    //     //     }
    //     // }
        // }
        // }
    // }
    // }
    // }

    export function initialiseStatic() {
        Field.initialiseStaticField();
    }
}

export namespace CallPutModule {
    export function initialiseStatic() {
        CallPut.initialiseStatic();
    }
}
