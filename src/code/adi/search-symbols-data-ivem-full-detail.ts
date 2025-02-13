import {
    EnumInfoOutOfOrderError,
    Integer,
    MultiEvent,
    SourceTzOffsetDate,
    isUndefinableArrayEqualUniquely,
    isUndefinableDecimalEqual
} from '@xilytix/sysutils';
import { Decimal } from 'decimal.js-light';
import { StringId, Strings } from '../res/internal-api';
import { FieldDataTypeId } from '../sys/internal-api';
import {
    CallOrPutId,
    DataIvemAlternateCodes,
    // DataIvemAlternateCodes,
    DataIvemAttributes,
    DepthDirectionId,
    ExerciseTypeId,
    SymbolsDataMessage,
    TmcLegs
} from './common/internal-api';
import { MarketsService } from './markets/internal-api';
import { SearchSymbolsDataIvemBaseDetail } from './search-symbols-data-ivem-base-detail';

export class SearchSymbolsDataIvemFullDetail extends SearchSymbolsDataIvemBaseDetail {
    private _cfi: string | undefined;
    private _depthDirectionId: DepthDirectionId | undefined;
    private _isIndex: boolean | undefined;
    private _expiryDate: SourceTzOffsetDate | undefined;
    private _strikePrice: Decimal | undefined;
    private _exerciseTypeId: ExerciseTypeId | undefined;
    private _callOrPutId: CallOrPutId | undefined;
    private _contractSize: Decimal | undefined;
    private _lotSize: Integer | undefined;
    private _attributes: DataIvemAttributes | undefined;
    private _tmcLegs: TmcLegs | undefined;
    private _categories: readonly string[] | undefined;
    private _alternateCodes: DataIvemAlternateCodes; // Want to move into Base in future

    private _extendedChangeEvent = new MultiEvent<SearchSymbolsDataIvemFullDetail.ExtendedChangeEventHandler>();

    constructor(marketsService: MarketsService, change: SymbolsDataMessage.AddChange) {
        super(marketsService, change, true);

        this._cfi = change.cfi;
        this._depthDirectionId = change.depthDirectionId;
        this._isIndex = change.isIndex;
        this._expiryDate = change.expiryDate;
        this._strikePrice = change.strikePrice;
        this._exerciseTypeId = change.exerciseTypeId;
        this._callOrPutId = change.callOrPutId;
        this._contractSize = change.contractSize;
        this._lotSize = change.lotSize;
        this._attributes = change.attributes;
        this._tmcLegs = change.tmcLegs;
        this._categories = change.categories;
        const alternateCodes = change.alternateCodes;
        this._alternateCodes = alternateCodes === undefined ? {} : alternateCodes;
    }

    get cfi(): string | undefined { return this._cfi; }
    get depthDirectionId(): DepthDirectionId | undefined { return this._depthDirectionId; }
    get isIndex(): boolean | undefined { return this._isIndex; }
    get expiryDate(): SourceTzOffsetDate | undefined { return this._expiryDate; }
    get strikePrice(): Decimal | undefined { return this._strikePrice; }
    get exerciseTypeId(): ExerciseTypeId | undefined { return this._exerciseTypeId; }
    get callOrPutId(): CallOrPutId | undefined { return this._callOrPutId; }
    get contractSize(): Decimal | undefined { return this._contractSize; }
    get lotSize(): Integer | undefined { return this._lotSize; }
    get attributes(): DataIvemAttributes | undefined { return this._attributes; }
    get tmcLegs(): TmcLegs | undefined { return this._tmcLegs; }
    get categories(): readonly string[] | undefined { return this._categories; }
    override get alternateCodes(): DataIvemAlternateCodes { return this._alternateCodes; } // Want to move into Base in future

    override update(change: SymbolsDataMessage.UpdateChange) {
        super.update(change);

        const changeableFieldCount = SearchSymbolsDataIvemFullDetail.ExtendedField.idCount - SearchSymbolsDataIvemFullDetail.Key.fieldCount;
        const changedFieldIds = new Array<SearchSymbolsDataIvemFullDetail.ExtendedField.Id>(changeableFieldCount); // won't include fields in key
        let changedCount = 0;

        if (change.cfi !== undefined) {
            const newCfi = change.cfi;
            if (newCfi !== this._cfi) {
                this._cfi = newCfi;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Cfi;
            }
        }
        if (change.depthDirectionId !== undefined) {
            const newDepthDirectionId = change.depthDirectionId ?? undefined;
            if (newDepthDirectionId !== this._depthDirectionId) {
                this._depthDirectionId = newDepthDirectionId;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.DepthDirectionId;
            }
        }
        if (change.isIndex !== undefined) {
            const newIsIndex = change.isIndex ?? undefined;
            if (newIsIndex !== this._isIndex) {
                this._isIndex = newIsIndex;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.IsIndex;
            }
        }
        if (change.expiryDate !== undefined) {
            const newExpiryDate = change.expiryDate ?? undefined;
            if (!SourceTzOffsetDate.isUndefinableEqual(newExpiryDate, this._expiryDate)) {
                this._expiryDate = newExpiryDate;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ExpiryDate;
            }
        }
        if (change.strikePrice !== undefined) {
            const newStrikePrice = change.strikePrice ?? undefined;
            if (!isUndefinableDecimalEqual(newStrikePrice, this._strikePrice)) {
                this._strikePrice = newStrikePrice;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.StrikePrice;
            }
        }
        if (change.exerciseTypeId !== undefined) {
            const newExerciseTypeId = change.exerciseTypeId ?? undefined;
            if (newExerciseTypeId !== this._exerciseTypeId) {
                this._exerciseTypeId = newExerciseTypeId;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ExerciseTypeId;
            }
        }
        if (change.callOrPutId !== undefined) {
            const newCallOrPutId = change.callOrPutId ?? undefined;
            if (newCallOrPutId !== this._callOrPutId) {
                this._callOrPutId = newCallOrPutId;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.CallOrPutId;
            }
        }
        if (change.contractSize !== undefined) {
            const newContractSize = change.contractSize ?? undefined;
            if (!isUndefinableDecimalEqual(newContractSize, this._contractSize)) {
                this._contractSize = newContractSize;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ContractSize;
            }
        }
        if (change.lotSize !== undefined) {
            const newLotSize = change.lotSize ?? undefined;
            if (newLotSize !== this._lotSize) {
                this._lotSize = newLotSize;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.LotSize;
            }
        }
        if (change.attributes !== undefined) {
            const newAttributes = change.attributes ?? undefined;
            if (!DataIvemAttributes.isUndefinableEqual(newAttributes, this._attributes)) {
                this._attributes = newAttributes;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Attributes;
            }
        }
        if (change.tmcLegs !== undefined) {
            const newTmcLegs = change.tmcLegs ?? undefined;
            if (!TmcLegs.isUndefinableEqualUniquely(newTmcLegs, this._tmcLegs)) {
                this._tmcLegs = newTmcLegs;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.TmcLegs;
            }
        }
        if (change.categories !== undefined) {
            const newCategories = change.categories ?? undefined;
            if (!isUndefinableArrayEqualUniquely(newCategories, this._categories)) {
                this._categories = newCategories;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Categories;
            }
        }

        let newAlternateCodes = change.alternateCodes;
        if (newAlternateCodes !== undefined) {
            if (newAlternateCodes === null) {
                newAlternateCodes = {};
            }
            if (!DataIvemAlternateCodes.isEqual(newAlternateCodes, this.alternateCodes)) {
                this._alternateCodes = newAlternateCodes;
                changedFieldIds[changedCount++] = SearchSymbolsDataIvemFullDetail.ExtendedField.Id.AlternateCodes;
            }
        }

        if (changedCount >= 0) {
            changedFieldIds.length = changedCount;
            this.notifyExtendedChange(changedFieldIds);
        }
    }

    subscribeExtendedChangeEvent(handler: SearchSymbolsDataIvemFullDetail.ExtendedChangeEventHandler) {
        return this._extendedChangeEvent.subscribe(handler);
    }

    unsubscribeExtendedChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._extendedChangeEvent.unsubscribe(subscriptionId);
    }

    private notifyExtendedChange(changedFieldIds: SearchSymbolsDataIvemFullDetail.ExtendedField.Id[]) {
        const handlers = this._extendedChangeEvent.copyHandlers();
        for (const handler of handlers) {
            handler(changedFieldIds);
        }
    }
}

export namespace SearchSymbolsDataIvemFullDetail {
    export type ExtendedChangeEventHandler = (this: void, changedFieldIds: ExtendedField.Id[]) => void;

    export namespace ExtendedField {
        export const enum Id {
            Cfi,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            DepthDirectionId,
            IsIndex,
            ExpiryDate,
            StrikePrice,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            ExerciseTypeId,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            CallOrPutId,
            ContractSize,
            LotSize,
            // AlternateCodes,
            Attributes,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            TmcLegs,
            Categories,
            AlternateCodes,
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
            Cfi: {
                id: Id.Cfi,
                name: 'Cfi',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.ExtendedDataIvemDetailDisplay_Cfi,
                headingId: StringId.ExtendedDataIvemDetailHeading_Cfi,
            },
            DepthDirectionId: {
                id: Id.DepthDirectionId,
                name: 'DepthDirectionId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.ExtendedDataIvemDetailDisplay_DepthDirectionId,
                headingId: StringId.ExtendedDataIvemDetailHeading_DepthDirectionId,
            },
            IsIndex: {
                id: Id.IsIndex,
                name: 'IsIndex',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.ExtendedDataIvemDetailDisplay_IsIndex,
                headingId: StringId.ExtendedDataIvemDetailHeading_IsIndex,
            },
            ExpiryDate: {
                id: Id.ExpiryDate,
                name: 'ExpiryDate',
                dataTypeId: FieldDataTypeId.Date,
                displayId: StringId.ExtendedDataIvemDetailDisplay_ExpiryDate,
                headingId: StringId.ExtendedDataIvemDetailHeading_ExpiryDate,
            },
            StrikePrice: {
                id: Id.StrikePrice,
                name: 'StrikePrice',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.ExtendedDataIvemDetailDisplay_StrikePrice,
                headingId: StringId.ExtendedDataIvemDetailHeading_StrikePrice,
            },
            ExerciseTypeId: {
                id: Id.ExerciseTypeId,
                name: 'ExerciseTypeId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.ExtendedDataIvemDetailDisplay_ExerciseTypeId,
                headingId: StringId.ExtendedDataIvemDetailHeading_ExerciseTypeId,
            },
            CallOrPutId: {
                id: Id.CallOrPutId,
                name: 'CallOrPutId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.ExtendedDataIvemDetailDisplay_CallOrPutId,
                headingId: StringId.ExtendedDataIvemDetailHeading_CallOrPutId,
            },
            ContractSize: {
                id: Id.ContractSize,
                name: 'ContractSize',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.ExtendedDataIvemDetailDisplay_ContractSize,
                headingId: StringId.ExtendedDataIvemDetailHeading_ContractSize,
            },
            LotSize: {
                id: Id.LotSize,
                name: 'LotSize',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.ExtendedDataIvemDetailDisplay_LotSize,
                headingId: StringId.ExtendedDataIvemDetailHeading_LotSize,
            },
            Attributes: {
                id: Id.Attributes,
                name: 'Attributes',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.ExtendedDataIvemDetailDisplay_Attributes,
                headingId: StringId.ExtendedDataIvemDetailHeading_Attributes,
            },
            TmcLegs: {
                id: Id.TmcLegs,
                name: 'TmcLegs',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.ExtendedDataIvemDetailDisplay_TmcLegs,
                headingId: StringId.ExtendedDataIvemDetailHeading_TmcLegs,
            },
            Categories: {
                id: Id.Categories,
                name: 'Categories',
                dataTypeId: FieldDataTypeId.StringArray,
                displayId: StringId.ExtendedDataIvemDetailDisplay_Categories,
                headingId: StringId.ExtendedDataIvemDetailHeading_Categories,
            },
            AlternateCodes: {
                id: Id.AlternateCodes,
                name: 'AlternateCodes',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.ExtendedDataIvemDetailDisplay_AlternateCodes,
                headingId: StringId.ExtendedDataIvemDetailHeading_AlternateCodes,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export const allNames = new Array<string>(idCount);

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (infos[id].id !== id as Id) {
                    throw new EnumInfoOutOfOrderError('MyxDataIvemAttribute.Field', id, infos[id].name);
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

    export function is(base: SearchSymbolsDataIvemBaseDetail): base is SearchSymbolsDataIvemFullDetail {
        return base.full;
    }
}

export namespace FullDataIvemDetailModule {
    export function initialiseStatic() {
        SearchSymbolsDataIvemFullDetail.ExtendedField.initialise();
    }
}
