import {
    AssertInternalError,
    Integer,
    UnreachableCaseError
} from '@pbkware/js-utils';
import { RevHorizontalAlignId } from 'revgrid';
import { Order } from '../../../../adi/internal-api';
import {
    FieldDataType,
    FieldDataTypeId,
} from "../../../../sys/internal-api";
import {
    BooleanCorrectnessTableField,
    CorrectnessTableField,
    DecimalCorrectnessTableField,
    EnumCorrectnessTableField,
    IntegerArrayCorrectnessTableField,
    IntegerCorrectnessTableField,
    SourceTzOffsetDateTimeCorrectnessTableField,
    StringArrayCorrectnessTableField,
    StringCorrectnessTableField,
    TableField
} from '../../field/internal-api';
import {
    CorrectnessTableValue,
    CurrencyIdCorrectnessTableValue,
    DecimalCorrectnessTableValue,
    GridOrderTriggerTypeIdCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    IvemClassIdCorrectnessTableValue,
    OrderPriceUnitTypeIdCorrectnessTableValue,
    OrderRouteAlgorithmIdCorrectnessTableValue,
    OrderShortSellTypeIdCorrectnessTableValue,
    OrderSideIdCorrectnessTableValue,
    OrderStatusAllowIdArrayCorrectnessTableValue,
    OrderStatusReasonIdArrayCorrectnessTableValue,
    OrderTradeTypeIdCorrectnessTableValue,
    OrderTypeIdCorrectnessTableValue,
    PhysicalDeliveryCorrectnessTableValue,
    PriceCorrectnessTableValue,
    SourceTzOffsetDateTimeDateCorrectnessTableValue,
    StringArrayCorrectnessTableValue,
    StringCorrectnessTableValue,
    TimeInForceIdCorrectnessTableValue
} from '../../value/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';
import { TableFieldSourceDefinitionCachingFactory } from './table-field-source-definition-caching-factory';

export class OrderTableFieldSourceDefinition extends TableFieldSourceDefinition {
    override readonly fieldDefinitions: TableField.Definition[];

    constructor() {
        super(OrderTableFieldSourceDefinition.typeId);

        this.fieldDefinitions = this.createFieldDefinitions();
    }

    isFieldSupported(id: Order.FieldId) {
        return OrderTableFieldSourceDefinition.Field.isIdSupported(id);
    }

    getFieldNameById(id: Order.FieldId) {
        const sourcelessFieldName = OrderTableFieldSourceDefinition.Field.getNameById(id);
        return this.encodeFieldName(sourcelessFieldName);
    }

    getSupportedFieldNameById(id: Order.FieldId) {
        if (!this.isFieldSupported(id)) {
            throw new AssertInternalError('OTFSDGSFNBI31299', Order.Field.idToName(id));
        } else {
            return this.getFieldNameById(id);
        }
    }

    private createFieldDefinitions() {
        const result = new Array<TableField.Definition>(OrderTableFieldSourceDefinition.Field.count);
        let idx = 0;
        for (let fieldIdx = 0; fieldIdx < OrderTableFieldSourceDefinition.Field.count; fieldIdx++) {
            const sourcelessFieldName = OrderTableFieldSourceDefinition.Field.getName(fieldIdx);
            const dataTypeId = OrderTableFieldSourceDefinition.Field.getDataTypeId(fieldIdx);
            const textAlignId = FieldDataType.idIsNumber(dataTypeId) ? RevHorizontalAlignId.Right : RevHorizontalAlignId.Left;
            const fieldConstructor = OrderTableFieldSourceDefinition.Field.getTableFieldConstructor(fieldIdx);
            const valueConstructor = OrderTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);

            result[idx++] = new TableField.Definition(
                this,
                sourcelessFieldName,
                OrderTableFieldSourceDefinition.Field.getHeading(fieldIdx),
                textAlignId,
                fieldConstructor,
                valueConstructor,
            );
        }

        return result;
    }
}

export namespace OrderTableFieldSourceDefinition {
    export const typeId = TableFieldSourceDefinition.TypeId.Order;
    export type TypeId = typeof typeId;

    export namespace Field {
        const unsupportedIds: Order.FieldId[] = [];
        export const count = Order.Field.count - unsupportedIds.length;

        interface Info {
            readonly id: Order.FieldId;
            readonly fieldConstructor: CorrectnessTableField.Constructor;
            readonly valueConstructor: CorrectnessTableValue.Constructor;
        }

        const infos = new Array<Info>(count);
        const idFieldIndices = new Array<Integer>(Order.Field.count);

        function idToTableGridConstructors(id: Order.FieldId):
            TableFieldSourceDefinition.CorrectnessTableGridConstructors {
            switch (id) {
                case Order.FieldId.Id:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.AccountId:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.ExternalId:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.DepthOrderId:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.Status:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.StatusAllowIds:
                    return [IntegerArrayCorrectnessTableField, OrderStatusAllowIdArrayCorrectnessTableValue];
                case Order.FieldId.StatusReasonIds:
                    return [IntegerArrayCorrectnessTableField, OrderStatusReasonIdArrayCorrectnessTableValue];
                case Order.FieldId.TradingMarket:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.CurrencyId:
                    return [EnumCorrectnessTableField, CurrencyIdCorrectnessTableValue];
                case Order.FieldId.EstimatedBrokerage:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case Order.FieldId.CurrentBrokerage:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case Order.FieldId.EstimatedTax:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case Order.FieldId.CurrentTax:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case Order.FieldId.CurrentValue:
                    return [DecimalCorrectnessTableField, DecimalCorrectnessTableValue];
                case Order.FieldId.CreatedDate:
                    // return [SourceTzOffsetDateTimeDataItemTableField, SourceTzOffsetDateTimeCorrectnessTableValue];
                    return [SourceTzOffsetDateTimeCorrectnessTableField, SourceTzOffsetDateTimeDateCorrectnessTableValue];
                case Order.FieldId.UpdatedDate:
                    // return [SourceTzOffsetDateTimeDataItemTableField, SourceTzOffsetDateTimeCorrectnessTableValue];
                    return [SourceTzOffsetDateTimeCorrectnessTableField, SourceTzOffsetDateTimeDateCorrectnessTableValue];
                case Order.FieldId.StyleId:
                    return [EnumCorrectnessTableField, IvemClassIdCorrectnessTableValue];
                case Order.FieldId.Children:
                    return [StringArrayCorrectnessTableField, StringArrayCorrectnessTableValue];
                case Order.FieldId.ExecutedQuantity:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case Order.FieldId.AveragePrice:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case Order.FieldId.Exchange:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.Code:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.SideId:
                    return [EnumCorrectnessTableField, OrderSideIdCorrectnessTableValue];
                case Order.FieldId.ExtendedSideId:
                    return [EnumCorrectnessTableField, OrderTradeTypeIdCorrectnessTableValue];
                case Order.FieldId.BrokerageSchedule:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.EquityOrderTypeId:
                    return [EnumCorrectnessTableField, OrderTypeIdCorrectnessTableValue];
                case Order.FieldId.LimitPrice:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case Order.FieldId.Quantity:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case Order.FieldId.HiddenQuantity:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case Order.FieldId.MinimumQuantity:
                    return [IntegerCorrectnessTableField, IntegerCorrectnessTableValue];
                case Order.FieldId.TimeInForceId:
                    return [EnumCorrectnessTableField, TimeInForceIdCorrectnessTableValue];
                case Order.FieldId.ExpiryDate:
                    return [SourceTzOffsetDateTimeCorrectnessTableField, SourceTzOffsetDateTimeDateCorrectnessTableValue];
                case Order.FieldId.ShortSellTypeId:
                    return [EnumCorrectnessTableField, OrderShortSellTypeIdCorrectnessTableValue];
                case Order.FieldId.UnitTypeId:
                    return [EnumCorrectnessTableField, OrderPriceUnitTypeIdCorrectnessTableValue];
                case Order.FieldId.UnitAmount:
                    return [DecimalCorrectnessTableField, DecimalCorrectnessTableValue];
                case Order.FieldId.ManagedFundCurrency:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.PhysicalDelivery:
                    return [BooleanCorrectnessTableField, PhysicalDeliveryCorrectnessTableValue];
                case Order.FieldId.RouteAlgorithmId:
                    return [EnumCorrectnessTableField, OrderRouteAlgorithmIdCorrectnessTableValue];
                case Order.FieldId.RouteMarket:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];
                case Order.FieldId.TriggerTypeId:
                    return [EnumCorrectnessTableField, GridOrderTriggerTypeIdCorrectnessTableValue];
                case Order.FieldId.TriggerValue:
                    return [DecimalCorrectnessTableField, PriceCorrectnessTableValue];
                case Order.FieldId.TriggerExtraParams:
                    return [StringCorrectnessTableField, StringCorrectnessTableValue];

                default:
                    throw new UnreachableCaseError('OTFDSFITTGC10049334', id);
            }
        }

        export function getId(fieldIdx: Integer) {
            return infos[fieldIdx].id;
        }

        export function getName(fieldIdx: Integer) {
            return Order.Field.idToName(infos[fieldIdx].id);
        }

        export function getNameById(id: Order.FieldId) {
            return Order.Field.idToName(id);
        }

        export function getHeading(fieldIdx: Integer) {
            return Order.Field.idToHeading(infos[fieldIdx].id);
        }

        export function getDataTypeId(fieldIdx: Integer): FieldDataTypeId {
            return Order.Field.idToFieldDataTypeId(infos[fieldIdx].id);
        }

        export function getTableFieldConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].fieldConstructor;
        }

        export function getTableValueConstructor(fieldIdx: Integer) {
            return infos[fieldIdx].valueConstructor;
        }

        export function indexOfId(id: Order.FieldId) {
            return idFieldIndices[id];
        }

        export function isIdSupported(id: Order.FieldId) {
            return !unsupportedIds.includes(id);
        }

        export function initialiseFieldStatic() {
            let fieldIdx = 0;
            for (let id = 0; id < Order.Field.count; id++) {
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
        sourceTypeId: OrderTableFieldSourceDefinition.TypeId;
        id: Order.FieldId;
    }

    export function get(cachingFactoryService: TableFieldSourceDefinitionCachingFactory): OrderTableFieldSourceDefinition {
        return cachingFactoryService.get(typeId) as OrderTableFieldSourceDefinition;
    }

    export function initialiseStatic() {
        Field.initialiseFieldStatic();
    }
}
