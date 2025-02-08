import { RevColumnLayoutDefinition, RevHorizontalAlignId, RevRecordField, RevRecordSourcedFieldDefinition, RevRecordSourcedFieldSourceDefinition, RevSourcedFieldDefinition } from '@xilytix/revgrid';
import { DayTradesDataItem, MovementId, TradeFlagId } from '../../../adi/internal-api';
import { StringId, Strings } from '../../../res/internal-api';
import {
    DayTradesDataItemRecordTypeIdTextFormattableValue,
    IntegerTextFormattableValue,
    OrderSideIdTextFormattableValue,
    PriceTextFormattableValue,
    SourceTzOffsetDateTimeTimeTextFormattableValue,
    StringArrayTextFormattableValue,
    StringTextFormattableValue,
    TextFormattableValue,
    TradeAffectsIdArrayTextFormattableValue,
    TradeFlagIdArrayTextFormattableValue,
    TrendIdTextFormattableValue
} from '../../../services/internal-api';
import {
    ComparisonResult,
    CorrectnessId,
    Integer,
    SourceTzOffsetDateTime,
    UnreachableCaseError,
    compareArray,
    compareNumber,
    compareUndefinableDecimal,
    compareUndefinableInteger,
    compareUndefinableString
} from "../../../sys/internal-api";
import { AllowedGridField, GridField } from '../../field/internal-api';

/** @public */
export abstract class DayTradesGridField extends GridField implements RevRecordField {
    constructor(
        private readonly _id: DayTradesDataItem.Field.Id,
        definition: RevRecordSourcedFieldDefinition,
        private readonly _getDataItemCorrectnessIdEvent: DayTradesGridField.GetDataItemCorrectnessIdEventHandler,
    ) {
        super(definition);
    }

    get isBrokerPrivateData() { return DayTradesDataItem.Field.idToIsBrokerPrivateData(this._id); }

    override getViewValue(record: DayTradesDataItem.Record): TextFormattableValue {
        const { textFormattableValue, cellAttribute } = this.createTextFormattableValue(record);

        // add attributes in correct priority order.  1st will be applied last (highest priority)
        const correctnessId = this._getDataItemCorrectnessIdEvent();
        switch (correctnessId) {
            case CorrectnessId.Suspect: {
                textFormattableValue.addAttribute(TextFormattableValue.DataCorrectnessAttribute.suspect);
                break;
            }
            case CorrectnessId.Error: {
                textFormattableValue.addAttribute(TextFormattableValue.DataCorrectnessAttribute.error);
                break;
            }
            case CorrectnessId.Usable:
            case CorrectnessId.Good: {
                // can do other attributes if usable
                if (cellAttribute !== undefined) {
                    textFormattableValue.addAttribute(cellAttribute);
                }

                switch (record.typeId) {
                    case DayTradesDataItem.Record.TypeId.Cancelled:
                        textFormattableValue.addAttribute(TextFormattableValue.cancelledAttribute);
                        break;
                    case DayTradesDataItem.Record.TypeId.Canceller:
                        textFormattableValue.addAttribute(TextFormattableValue.cancellerAttribute);
                        break;
                }

                const tradeRecord = record.tradeRecord;

                if (tradeRecord.buyCrossRef !== undefined || tradeRecord.sellCrossRef !== undefined) {
                    textFormattableValue.addAttribute(TextFormattableValue.ownOrderAttribute);
                } else {
                    // const buyOrderId = tradeRecord.buyDepthOrderId;
                    // const sellOrderId = tradeRecord.sellDepthOrderId;
                    // const sideId = tradeRecord.orderSideId;

                    // if (sideId !== undefined) {
                    //     if (buyOrderId !== undefined || sellOrderId !== undefined) {
                    //         textFormattableValue.addAttribute(TextFormattableValue.ownOrderAttribute);
                    //     }
                    // }
                }

                break;
            }

            default:
                throw new UnreachableCaseError('TGFGFV229988', correctnessId);
        }


        return textFormattableValue;
    }

    compare(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record) {
        return this.compareValue(left, right, true);
    }

    compareDesc(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record) {
        return this.compareValue(right, left, false);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected addRenderAttributes(textFormattableValue: TextFormattableValue, record: DayTradesDataItem.Record, cellAttribute: TextFormattableValue.Attribute) {

    }

    protected abstract createTextFormattableValue(record: DayTradesDataItem.Record): DayTradesGridField.CreateTextFormattableValueResult;
    protected abstract compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean): number;
}

/** @public */
export namespace DayTradesGridField {
    export type Id = DayTradesDataItem.Field.Id;
    export const idCount = DayTradesDataItem.Field.idCount;
    export type GetDataItemCorrectnessIdEventHandler = (this: void) => CorrectnessId;

    export const sourceDefinition = new RevRecordSourcedFieldSourceDefinition('DayTrades');

    export interface CreateTextFormattableValueResult {
        textFormattableValue: TextFormattableValue;
        cellAttribute: TextFormattableValue.Attribute | undefined;
    }

    export function createField(
        id: Id,
        getDataItemCorrectnessIdEventHandler: GetDataItemCorrectnessIdEventHandler
    ): DayTradesGridField {
        switch (id) {
            case DayTradesDataItem.Field.Id.Id:
                return new IdDayTradesGridField(id, createIdRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.Price:
                return new PriceDayTradesGridField(id, createPriceRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.Quantity:
                return new QuantityDayTradesGridField(id, createQuantityRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.Time:
                return new TimeDayTradesGridField(id, createTimeRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.FlagIds:
                return new FlagIdsDayTradesGridField(id, createFlagIdsRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.TrendId:
                return new TrendIdDayTradesGridField(id, createTrendIdRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.OrderSideId:
                return new OrderSideIdDayTradesGridField(id, createOrderSideIdRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.AffectsIds:
                return new AffectsIdsDayTradesGridField(id, createAffectsIdsRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.ConditionCodes:
                return new ConditionCodesDayTradesGridField(id, createConditionCodesRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.BuyDepthOrderId:
                return new BuyDepthOrderIdDayTradesGridField(id, createBuyDepthOrderIdRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.BuyBroker:
                return new BuyBrokerDayTradesGridField(id, createBuyBrokerRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.BuyCrossRef:
                return new BuyCrossRefDayTradesGridField(id, createBuyCrossRefRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.SellDepthOrderId:
                return new SellDepthOrderIdDayTradesGridField(id, createSellDepthOrderIdRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.SellBroker:
                return new SellBrokerDayTradesGridField(id, createSellBrokerRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.SellCrossRef:
                return new SellCrossRefDayTradesGridField(id, createSellCrossRefRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.MarketId:
                return new MarketDayTradesGridField(id, createMarketIdRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.RelatedId:
                return new RelatedIdDayTradesGridField(id, createRelatedIdRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.Attributes:
                return new AttributesDayTradesGridField(id, createAttributesRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            case DayTradesDataItem.Field.Id.RecordTypeId:
                return new RecordTypeDayTradesGridField(id, createRecordTypeIdRevFieldDefinition(id), getDataItemCorrectnessIdEventHandler);
            default:
                throw new UnreachableCaseError('DTGFCF12934883446', id);
        }
    }

    export function createDefaultColumnLayoutDefinition() {
        const fieldIds: DayTradesGridField.Id[] = [
            DayTradesDataItem.Field.Id.Time,
            DayTradesDataItem.Field.Id.Price,
            DayTradesDataItem.Field.Id.Quantity,
        ];

        const count = fieldIds.length;
        const columns = new Array<RevColumnLayoutDefinition.Column>(count);
        for (let i = 0; i < count; i++) {
            const sourceName = DayTradesGridField.sourceDefinition.name;
            const fieldId = fieldIds[i];
            const sourcelessFieldName = DayTradesDataItem.Field.idToName(fieldId);
            const fieldName = RevSourcedFieldDefinition.Name.compose(sourceName, sourcelessFieldName);
            const column: RevColumnLayoutDefinition.Column = {
                fieldName,
                visible: undefined,
                autoSizableWidth: undefined,
            };
            columns[i] = column;
        }
        return new RevColumnLayoutDefinition(columns);
    }

    export function createAllowedFields(): readonly AllowedGridField[] {
        const count = DayTradesDataItem.Field.idCount;
        const fields = new Array<AllowedGridField>(count);
        for (let id = 0; id < count; id++) {
            const field = createAllowedField(id);
            fields[id] = field;
        }
        return fields;
    }

    function createAllowedField(id: DayTradesDataItem.Field.Id): AllowedGridField {
        switch (id) {
            case DayTradesDataItem.Field.Id.Id:
                return new AllowedGridField(createIdRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.Price:
                return new AllowedGridField(createPriceRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.Quantity:
                return new AllowedGridField(createQuantityRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.Time:
                return new AllowedGridField(createTimeRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.FlagIds:
                return new AllowedGridField(createFlagIdsRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.TrendId:
                return new AllowedGridField(createTrendIdRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.OrderSideId:
                return new AllowedGridField(createOrderSideIdRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.AffectsIds:
                return new AllowedGridField(createAffectsIdsRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.ConditionCodes:
                return new AllowedGridField(createConditionCodesRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.BuyDepthOrderId:
                return new AllowedGridField(createBuyDepthOrderIdRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.BuyBroker:
                return new AllowedGridField(createBuyBrokerRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.BuyCrossRef:
                return new AllowedGridField(createBuyCrossRefRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.SellDepthOrderId:
                return new AllowedGridField(createSellDepthOrderIdRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.SellBroker:
                return new AllowedGridField(createSellBrokerRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.SellCrossRef:
                return new AllowedGridField(createSellCrossRefRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.MarketId:
                return new AllowedGridField(createMarketIdRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.RelatedId:
                return new AllowedGridField(createRelatedIdRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.Attributes:
                return new AllowedGridField(createAttributesRevFieldDefinition(id));
            case DayTradesDataItem.Field.Id.RecordTypeId:
                return new AllowedGridField(createRecordTypeIdRevFieldDefinition(id));
            default:
                throw new UnreachableCaseError('DTGFCF12934883446', id);
        }
    }

    function createIdRevFieldDefinition(id: DayTradesDataItem.Field.Id) {
        return new RevRecordSourcedFieldDefinition(
            DayTradesGridField.sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_Id],
            RevHorizontalAlignId.Right,
        );
    }

    function createPriceRevFieldDefinition(id: DayTradesDataItem.Field.Id.Price) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_Price],
            RevHorizontalAlignId.Right,
        )
    }

    function createQuantityRevFieldDefinition(id: DayTradesDataItem.Field.Id.Quantity) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_Quantity],
            RevHorizontalAlignId.Right,
        )
    }

    function createTimeRevFieldDefinition(id: DayTradesDataItem.Field.Id.Time) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_Time],
            RevHorizontalAlignId.Left,
        )
    }

    function createFlagIdsRevFieldDefinition(id: DayTradesDataItem.Field.Id.FlagIds) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_FlagIds],
            RevHorizontalAlignId.Left,
        )
    }

    function createTrendIdRevFieldDefinition(id: DayTradesDataItem.Field.Id.TrendId) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_TrendId],
            RevHorizontalAlignId.Left,
        )
    }

    function createOrderSideIdRevFieldDefinition(id: DayTradesDataItem.Field.Id.OrderSideId) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_OrderSideId],
            RevHorizontalAlignId.Right,
        )
    }

    function createAffectsIdsRevFieldDefinition(id: DayTradesDataItem.Field.Id.AffectsIds) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_AffectsIds],
            RevHorizontalAlignId.Right,
        )
    }

    function createConditionCodesRevFieldDefinition(id: DayTradesDataItem.Field.Id.ConditionCodes) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_ConditionCodes],
            RevHorizontalAlignId.Right,
        )
    }

    function createBuyDepthOrderIdRevFieldDefinition(id: DayTradesDataItem.Field.Id.BuyDepthOrderId) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_BuyDepthOrderId],
            RevHorizontalAlignId.Right,
        )
    }

    function createBuyBrokerRevFieldDefinition(id: DayTradesDataItem.Field.Id.BuyBroker) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_BuyBroker],
            RevHorizontalAlignId.Right,
        )
    }

    function createBuyCrossRefRevFieldDefinition(id: DayTradesDataItem.Field.Id.BuyCrossRef) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_BuyCrossRef],
            RevHorizontalAlignId.Right,
        )
    }

    function createSellDepthOrderIdRevFieldDefinition(id: DayTradesDataItem.Field.Id.SellDepthOrderId) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_SellDepthOrderId],
            RevHorizontalAlignId.Right,
        )
    }

    function createSellBrokerRevFieldDefinition(id: DayTradesDataItem.Field.Id.SellBroker) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_SellBroker],
            RevHorizontalAlignId.Right,
        )
    }

    function createSellCrossRefRevFieldDefinition(id: DayTradesDataItem.Field.Id.SellCrossRef) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_SellCrossRef],
            RevHorizontalAlignId.Right,
        )
    }

    function createMarketIdRevFieldDefinition(id: DayTradesDataItem.Field.Id.MarketId) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_MarketId],
            RevHorizontalAlignId.Right,
        )
    }

    function createRelatedIdRevFieldDefinition(id: DayTradesDataItem.Field.Id.RelatedId) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_RelatedId],
            RevHorizontalAlignId.Right,
        )
    }

    function createAttributesRevFieldDefinition(id: DayTradesDataItem.Field.Id.Attributes) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_Attributes],
            RevHorizontalAlignId.Right,
        )
    }

    function createRecordTypeIdRevFieldDefinition(id: DayTradesDataItem.Field.Id.RecordTypeId) {
        return new RevRecordSourcedFieldDefinition(
            sourceDefinition,
            DayTradesDataItem.Field.idToName(id),
            Strings[StringId.DayTradesGridHeading_RecordType],
            RevHorizontalAlignId.Right,
        )
    }
}

/** @internal */
export class IdDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new IntegerTextFormattableValue(record.tradeRecord.id),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record): ComparisonResult {
        return compareNumber(left.tradeRecord.id, right.tradeRecord.id);
    }
}

/** @internal */
export class PriceDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        let cellAttribute: TextFormattableValue.HigherLowerAttribute | undefined;
        switch (record.tradeRecord.trendId) {
            case MovementId.Up:
                cellAttribute = TextFormattableValue.HigherLowerAttribute.higher;
                break;
            case MovementId.Down:
                cellAttribute = TextFormattableValue.HigherLowerAttribute.lower;
                break;

            default:
                cellAttribute = undefined;
        }

        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new PriceTextFormattableValue(record.tradeRecord.price),
            cellAttribute,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableDecimal(left.tradeRecord.price, right.tradeRecord.price, !ascending);
    }
}

/** @internal */
export class QuantityDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        let quantity: Integer | undefined;
        if (record.relatedRecord !== undefined && record.tradeRecord.flagIds.includes(TradeFlagId.Cancel)) {
            const tradeQuantity = record.relatedRecord.tradeRecord.quantity;
            if (tradeQuantity === undefined) {
                quantity = undefined;
            } else {
                quantity = -tradeQuantity;
            }
        } else {
            quantity = record.tradeRecord.quantity;
        }

        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new IntegerTextFormattableValue(quantity),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableInteger(left.tradeRecord.quantity, right.tradeRecord.quantity, !ascending);
    }
}

/** @internal */
export class TimeDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new SourceTzOffsetDateTimeTimeTextFormattableValue(record.tradeRecord.time),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return SourceTzOffsetDateTime.compareUndefinable(left.tradeRecord.time, right.tradeRecord.time, !ascending);
    }
}

/** @internal */
export class FlagIdsDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new TradeFlagIdArrayTextFormattableValue(record.tradeRecord.flagIds),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareArray(left.tradeRecord.flagIds, right.tradeRecord.flagIds);
    }
}

/** @internal */
export class TrendIdDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new TrendIdTextFormattableValue(record.tradeRecord.trendId),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableInteger(left.tradeRecord.trendId, right.tradeRecord.trendId, !ascending);
    }
}

/** @internal */
export class OrderSideIdDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new OrderSideIdTextFormattableValue(record.tradeRecord.orderSideId),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableInteger(left.tradeRecord.orderSideId, right.tradeRecord.orderSideId, !ascending);
    }
}

/** @internal */
export class AffectsIdsDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new TradeAffectsIdArrayTextFormattableValue(record.tradeRecord.affectsIds),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareArray(left.tradeRecord.affectsIds, right.tradeRecord.affectsIds);
    }
}

/** @internal */
export class ConditionCodesDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringTextFormattableValue(record.tradeRecord.conditionCodes),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableString(left.tradeRecord.conditionCodes, right.tradeRecord.conditionCodes, !ascending);
    }
}

/** @internal */
export class BuyDepthOrderIdDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringTextFormattableValue(record.tradeRecord.buyDepthOrderId),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableString(left.tradeRecord.buyDepthOrderId, right.tradeRecord.buyDepthOrderId, !ascending);
    }
}

/** @internal */
export class BuyBrokerDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringTextFormattableValue(record.tradeRecord.buyBroker),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableString(left.tradeRecord.buyBroker, right.tradeRecord.buyBroker, !ascending);
    }
}

/** @internal */
export class BuyCrossRefDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringTextFormattableValue(record.tradeRecord.buyCrossRef),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableString(left.tradeRecord.buyCrossRef, right.tradeRecord.buyCrossRef, !ascending);
    }
}

/** @internal */
export class SellDepthOrderIdDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringTextFormattableValue(record.tradeRecord.sellDepthOrderId),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableString(left.tradeRecord.sellDepthOrderId, right.tradeRecord.sellDepthOrderId, !ascending);
    }
}

/** @internal */
export class SellBrokerDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringTextFormattableValue(record.tradeRecord.sellBroker),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableString(left.tradeRecord.sellBroker, right.tradeRecord.sellBroker, !ascending);
    }
}

/** @internal */
export class SellCrossRefDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringTextFormattableValue(record.tradeRecord.sellCrossRef),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableString(left.tradeRecord.sellCrossRef, right.tradeRecord.sellCrossRef, !ascending);
    }
}

/** @internal */
export class MarketDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const market = record.tradeRecord.market;
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringTextFormattableValue(market === undefined ? undefined : market.display),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        const leftMarket = left.tradeRecord.market;
        const leftMarketDisplay = leftMarket === undefined ? undefined : leftMarket.display;
        const rightMarket = right.tradeRecord.market;
        const rightMarketDisplay = rightMarket === undefined ? undefined : rightMarket.display;
        return compareUndefinableString(leftMarketDisplay, rightMarketDisplay, !ascending);
    }
}

/** @internal */
export class RelatedIdDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new IntegerTextFormattableValue(record.tradeRecord.relatedId),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record, ascending: boolean) {
        return compareUndefinableInteger(left.tradeRecord.relatedId, right.tradeRecord.relatedId, !ascending);
    }
}

/** @internal */
export class AttributesDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new StringArrayTextFormattableValue(record.tradeRecord.attributes),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record) {
        return compareArray(left.tradeRecord.attributes, right.tradeRecord.attributes);
    }
}

/** @internal */
export class RecordTypeDayTradesGridField extends DayTradesGridField {
    protected createTextFormattableValue(record: DayTradesDataItem.Record) {
        const result: DayTradesGridField.CreateTextFormattableValueResult = {
            textFormattableValue: new DayTradesDataItemRecordTypeIdTextFormattableValue(record.typeId),
            cellAttribute: undefined,
        };
        return result;
    }

    protected compareValue(left: DayTradesDataItem.Record, right: DayTradesDataItem.Record) {
        return DayTradesDataItem.Record.Type.sortCompareId(left.typeId, right.typeId);
    }
}
