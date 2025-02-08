import { RevHorizontalAlignId } from '@xilytix/revgrid';
import { SecurityDataItem } from '../../../../adi/internal-api';
import {
    AssertInternalError,
    FieldDataType,
    FieldDataTypeId,
    Integer,
    UnexpectedCaseError,
    UnreachableCaseError
} from "../../../../sys/internal-api";
import {
    BooleanCorrectnessTableField,
    CorrectnessTableField,
    DataIvemIdCorrectnessTableField,
    DecimalCorrectnessTableField,
    EnumCorrectnessTableField,
    IntegerArrayCorrectnessTableField,
    IntegerCorrectnessTableField,
    SourceTzOffsetDateCorrectnessTableField,
    StringArrayCorrectnessTableField,
    StringCorrectnessTableField,
    TableField
} from '../../field/internal-api';
import {
    CallOrPutCorrectnessTableValue,
    CorrectnessTableValue,
    CurrencyIdCorrectnessTableValue,
    DataIvemIdCorrectnessTableValue,
    DecimalCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    IsIndexCorrectnessTableValue,
    IvemClassIdCorrectnessTableValue,
    PriceCorrectnessTableValue,
    PublisherSubscriptionDataTypeIdArrayCorrectnessTableValue,
    SourceTzOffsetDateCorrectnessTableValue,
    StringArrayCorrectnessTableValue,
    StringCorrectnessTableValue,
    TradingStateAllowIdArrayCorrectnessTableValue,
    TradingStateReasonIdCorrectnessTableValue,
    UndisclosedCorrectnessTableValue
} from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';

export abstract class PrefixableSecurityDataItemTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor(
        typeId: TableFieldSourceDefinition.TypeId,
        protected readonly _prefix: string
    ) {
        super(typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: SecurityDataItem.FieldId) {
        return PrefixableSecurityDataItemTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: SecurityDataItem.FieldId) {
        const sourcelessFieldName = this._prefix + PrefixableSecurityDataItemTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: SecurityDataItem.FieldId) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('PSDITFSDGSFNBI31399', SecurityDataItem.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(PrefixableSecurityDataItemTableFieldSourceDefinition.Field.count);
        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < PrefixableSecurityDataItemTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = this._prefix + PrefixableSecurityDataItemTableFieldSourceDefinition.Field.getName(fieldIdx);
            const dataTypeId = PrefixableSecurityDataItemTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = PrefixableSecurityDataItemTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = PrefixableSecurityDataItemTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
                this,
                sourcelessFieldName,
                this._prefix + PrefixableSecurityDataItemTableFieldSourceDefinition.Field.getHeading(fieldIdx),
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

export namespace PrefixableSecurityDataItemTableFieldSourceDefinition {
    export namespace Field {
        const unsupportedIds = [SecurityDataItem.FieldId.Trend];
        export const count = SecurityDataItem.Field.idCount - unsupportedIds.length;

        interface Info {
            readonly id: SecurityDataItem.FieldId;
            readonly fieldConstructor: CorrectnessTableField.Constructor;
            readonly valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(SecurityDataItem.Field.idCount);

        function idToTableGridConstructors(id: SecurityDataItem.FieldId): TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case SecurityDataItem.FieldId.DataIvemId:
                    return [DataIvemIdCorrectnessTableField, DataIvemIdCorrectnessTableValue];
                case SecurityDataItem.FieldId.Code:
                case SecurityDataItem.FieldId.Name:
                case SecurityDataItem.FieldId.TradingState:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case SecurityDataItem.FieldId.QuotationBasis:
                case SecurityDataItem.FieldId.StatusNote:
                    return [StringArrayCorrectnessTableField, StringArrayCorrectnessTableValue];
                case SecurityDataItem.FieldId.AskCount:
                case SecurityDataItem.FieldId.BidCount:
                case SecurityDataItem.FieldId.NumberOfTrades:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case SecurityDataItem.FieldId.AskQuantity:
                case SecurityDataItem.FieldId.BidQuantity:
                case SecurityDataItem.FieldId.ContractSize:
                case SecurityDataItem.FieldId.AuctionQuantity:
                case SecurityDataItem.FieldId.AuctionRemainder:
                case SecurityDataItem.FieldId.Volume:
                case SecurityDataItem.FieldId.ValueTraded:
                case SecurityDataItem.FieldId.ShareIssue:
                    return [DecimalCorrectnessTableField, DecimalCorrectnessTableValue];
                case SecurityDataItem.FieldId.OpenInterest:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case SecurityDataItem.FieldId.Market:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case SecurityDataItem.FieldId.Exchange:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case SecurityDataItem.FieldId.Class:
                    return [EnumCorrectnessTableField, IvemClassIdCorrectnessTableValue];
                case SecurityDataItem.FieldId.Cfi:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case SecurityDataItem.FieldId.Currency:
                    return [EnumCorrectnessTableField, CurrencyIdCorrectnessTableValue];
                case SecurityDataItem.FieldId.TradingStateReason:
                    return [EnumCorrectnessTableField, TradingStateReasonIdCorrectnessTableValue];
                case SecurityDataItem.FieldId.CallOrPut:
                    return [EnumCorrectnessTableField, CallOrPutCorrectnessTableValue];
                case SecurityDataItem.FieldId.TradingStateAllows:
                    return [IntegerArrayCorrectnessTableField, TradingStateAllowIdArrayCorrectnessTableValue];
                case SecurityDataItem.FieldId.TradingMarkets:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case SecurityDataItem.FieldId.IsIndex:
                    return [BooleanCorrectnessTableField, IsIndexCorrectnessTableValue];
                case SecurityDataItem.FieldId.AskUndisclosed:
                case SecurityDataItem.FieldId.BidUndisclosed:
                    return [BooleanCorrectnessTableField, UndisclosedCorrectnessTableValue];
                case SecurityDataItem.FieldId.StrikePrice:
                case SecurityDataItem.FieldId.Open:
                case SecurityDataItem.FieldId.High:
                case SecurityDataItem.FieldId.Low:
                case SecurityDataItem.FieldId.Close:
                case SecurityDataItem.FieldId.Settlement:
                case SecurityDataItem.FieldId.BestAsk:
                case SecurityDataItem.FieldId.BestBid:
                case SecurityDataItem.FieldId.AuctionPrice:
                case SecurityDataItem.FieldId.VWAP:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case SecurityDataItem.FieldId.Last:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case SecurityDataItem.FieldId.ExpiryDate:
                    return [SourceTzOffsetDateCorrectnessTableField, SourceTzOffsetDateCorrectnessTableValue];
                case SecurityDataItem.FieldId.SubscriptionDataTypeIds:
                    return [IntegerArrayCorrectnessTableField, PublisherSubscriptionDataTypeIdArrayCorrectnessTableValue];
                case SecurityDataItem.FieldId.Trend:
                    throw new UnexpectedCaseError('PSDITFDSFITTGCC349928');
                default:
                    throw new UnreachableCaseError('PSDITFDSFITTGCU2200191', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return SecurityDataItem.Field.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: SecurityDataItem.FieldId) {
            return SecurityDataItem.Field.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return SecurityDataItem.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return SecurityDataItem.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: SecurityDataItem.FieldId) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: SecurityDataItem.FieldId) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseDataIvemIdSecurityWatchValueSourceField() {
            let fieldIdx = 0;
            for (let id = 0; id < SecurityDataItem.Field.idCount; id++) {
                if (unsupportedIds.includes(id)) {
                    idFieldIndices[id] = -1;
                } else {
                    idFieldIndices[id] = fieldIdx;

                    const [fieldConstructor, valueConstructor] = idToTableGridConstructors(id);
                    infos[fieldIdx++] = {
                        id,
                        fieldConstructor,
                        valueConstructor,
                    };
                }
            }
        }
    }

    export interface FieldId extends TableFieldSourceDefinition.FieldId {
        id: SecurityDataItem.FieldId;
    }

    export function initialiseStatic() {
        Field.initialiseDataIvemIdSecurityWatchValueSourceField();
    }
}
