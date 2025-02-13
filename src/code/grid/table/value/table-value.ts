import { RevTableValue } from '@xilytix/revgrid';
import {
    Integer,
    SourceTzOffsetDate,
    SourceTzOffsetDateTime,
    newUndefinableDate,
    newUndefinableDecimal
} from '@xilytix/sysutils';
import { Decimal } from 'decimal.js-light';
import { DataIvemId, IvemId } from '../../../adi/internal-api';
import {
    BooleanTextFormattableValue,
    DataIvemIdTextFormattableValue,
    DateTextFormattableValue,
    DateTimeTextFormattableValue,
    DecimalTextFormattableValue,
    EnumTextFormattableValue,
    IntegerArrayTextFormattableValue,
    IntegerTextFormattableValue,
    IvemIdTextFormattableValue,
    NumberTextFormattableValue,
    PercentageTextFormattableValue,
    PriceTextFormattableValue,
    SourceTzOffsetDateTextFormattableValue,
    SourceTzOffsetDateTimeDateTextFormattableValue,
    SourceTzOffsetDateTimeTextFormattableValue,
    StringArrayTextFormattableValue,
    StringTextFormattableValue,
    TextFormattableValue
} from '../../../services/internal-api';
import {
    CorrectnessId,
} from '../../../sys/internal-api';

export abstract class TableValue extends RevTableValue<TextFormattableValue.TypeId, TextFormattableValue.Attribute.TypeId> {
}

export namespace TableValue {
    export type Constructor = new() => TableValue;
}

export abstract class GenericTableValue<T> extends TableValue {
    private _data: T | undefined;
    private _definedData: T;

    get definedData() { return this._definedData; }

    get data() { return this._data; }
    set data(value: T | undefined) {
        this._data = value;
        if (value !== undefined) {
            this._definedData = value;
        }
    }

    isUndefined() {
        return this._data === undefined;
    }

    clear() {
        this._data = undefined;
    }
}

export class StringTableValue extends GenericTableValue<string> {
    protected createTextFormattableValue() {
        return new StringTextFormattableValue(this.data);
    }
}
export abstract class BaseNumberTableValue extends GenericTableValue<number> {
}
export class NumberTableValue extends BaseNumberTableValue {
    protected createTextFormattableValue() {
        return new NumberTextFormattableValue(this.data);
    }
}
export class PercentageTableValue extends BaseNumberTableValue {
    protected createTextFormattableValue() {
        return new PercentageTextFormattableValue(this.data);
    }
}
export class IntegerTableValue extends GenericTableValue<Integer> {
    protected createTextFormattableValue() {
        return new IntegerTextFormattableValue(this.data);
    }
}
export class DateTableValue extends GenericTableValue<Date> {
    override get data() { return super.data; }

    override set data(value: Date | undefined) {
        super.data = newUndefinableDate(value);
    }

    protected createTextFormattableValue() {
        return new DateTextFormattableValue(this.data);
    }
}
export class IvemIdTableValue extends GenericTableValue<IvemId> {
    override get data() { return super.data; }
    override set data(value: IvemId | undefined) {
        super.data = value?.createCopy();
    }

    protected createTextFormattableValue() {
        return new IvemIdTextFormattableValue(this.data);
    }
}
export class DataIvemIdTableValue extends GenericTableValue<DataIvemId> {
    override get data() { return super.data; }
    override set data(value: DataIvemId | undefined) {
        super.data = value?.createCopy();
    }

    protected createTextFormattableValue() {
        return new DataIvemIdTextFormattableValue(this.data);
    }
}

export abstract class BaseDecimalTableValue extends GenericTableValue<Decimal> {
    // protected createTextFormattableValue() {
    //     return new DecimalTextFormattableValue(this.data);
    // }

    override get data() { return super.data; }

    override set data(value: Decimal | undefined) {
        super.data = newUndefinableDecimal(value);
    }
}
export class DecimalTableValue extends BaseDecimalTableValue {
    protected createTextFormattableValue() {
        return new DecimalTextFormattableValue(this.data);
    }
}
export class PriceTableValue extends BaseDecimalTableValue {
    protected createTextFormattableValue() {
        return new PriceTextFormattableValue(this.data);
    }
}

export abstract class BooleanTableValue extends GenericTableValue<boolean> {
    protected textFormattableValueTypeId: TextFormattableValue.TypeId;

    protected createTextFormattableValue() {
        return new BooleanTextFormattableValue(this.data, this.textFormattableValueTypeId);
    }
}
export class RenderBooleanTableValue extends BooleanTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.RenderBoolean;
    }
}
export class IsIndexTableValue extends BooleanTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.IsIndex;
    }
}
export class VisibleTableValue extends BooleanTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Visible;
    }
}
export class EnabledTableValue extends BooleanTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Enabled;
    }
}
export class ValidTableValue extends BooleanTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Valid;
    }
}
export class FaultedTableValue extends BooleanTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Faulted;
    }
}

export abstract class EnumTableValue extends GenericTableValue<Integer> {
    protected textFormattableValueTypeId: TextFormattableValue.TypeId;

    protected createTextFormattableValue() {
        return new EnumTextFormattableValue(this.data, this.textFormattableValueTypeId);
    }
}
export class ActiveFaultedStatusIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.ActiveFaultedStatusId;
    }
}
export class SymbolFieldIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.SymbolFieldId;
    }
}
export class ExerciseTypeIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.ExerciseTypeId;
    }
}
export class TradingStateReasonIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.TradingStateReasonId;
    }
}
export class OrderTradeTypeIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderTradeTypeId;
    }
}
export class OrderTypeIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderTypeId;
    }
}
export class TimeInForceIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.TimeInForceId;
    }
}
export class OrderTriggerTypeIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderTriggerTypeId;
    }
}
export class GridOrderTriggerTypeIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.GridOrderTriggerTypeId;
    }
}
export class ScanFieldBooleanOperationIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.ScanFieldBooleanOperationId;
    }
}
export class NotificationChannelSourceSettingsUrgencyIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.NotificationChannelSourceSettingsUrgencyId;
    }
}
export class NotificationDistributionMethodIdTableValue extends EnumTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.NotificationDistributionMethodId;
    }
}

export abstract class BaseIntegerArrayTableValue extends GenericTableValue<Integer[]> {
    protected textFormattableValueTypeId: TextFormattableValue.TypeId;

    protected createTextFormattableValue() {
        return new IntegerArrayTextFormattableValue(this.data, this.textFormattableValueTypeId);
    }
}

export abstract class BaseReadonlyIntegerArrayTableValue extends GenericTableValue<readonly Integer[]> {
    protected textFormattableValueTypeId: TextFormattableValue.TypeId;

    protected createTextFormattableValue() {
        return new IntegerArrayTextFormattableValue(this.data, this.textFormattableValueTypeId);
    }
}

export class IntegerArrayTableValue extends BaseIntegerArrayTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.IntegerArray;
    }
}

export class TradingStateAllowIdArrayTableValue extends BaseReadonlyIntegerArrayTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.TradingStateAllowIdArray;
    }
}

export abstract class CorrectnessTableValue extends TableValue {
    _correctnessId: CorrectnessId;

    get dataCorrectnessId() { return this._correctnessId; }
    set dataCorrectnessId(value: CorrectnessId) {
        this._correctnessId = value;
        switch (value) {
            case CorrectnessId.Suspect:
                this.addRenderAttribute(TextFormattableValue.DataCorrectnessAttribute.suspect);
                break;
            case CorrectnessId.Error:
                this.addRenderAttribute(TextFormattableValue.DataCorrectnessAttribute.error);
                break;
        }
    }
}

export namespace CorrectnessTableValue {

    export type Constructor = new() => CorrectnessTableValue;
}

export abstract class GenericCorrectnessTableValue<T> extends CorrectnessTableValue {
    private _data: T | undefined;
    private _definedData: T;

    get definedData() { return this._definedData; }

    get data() { return this._data; }
    set data(value: T | undefined) {
        this._data = value;
        if (value !== undefined) {
            this._definedData = value;
        }
    }

    isUndefined() {
        return this._data === undefined;
    }

    clear() {
        this._data = undefined;
    }
}

export class StringCorrectnessTableValue extends GenericCorrectnessTableValue<string> {
    protected createTextFormattableValue() {
        return new StringTextFormattableValue(this.data);
    }
}
export abstract class BaseNumberCorrectnessTableValue extends GenericCorrectnessTableValue<number> {
}
export class NumberCorrectnessTableValue extends BaseNumberCorrectnessTableValue {
    protected createTextFormattableValue() {
        return new NumberTextFormattableValue(this.data);
    }
}
export class PercentageCorrectnessTableValue extends BaseNumberCorrectnessTableValue {
    protected createTextFormattableValue() {
        return new PercentageTextFormattableValue(this.data);
    }
}
export class IntegerCorrectnessTableValue extends GenericCorrectnessTableValue<Integer> {
    protected createTextFormattableValue() {
        return new IntegerTextFormattableValue(this.data);
    }
}

export abstract class BaseDateCorrectnessTableValue extends GenericCorrectnessTableValue<Date> {
    override get data() { return super.data; }
    override set data(value: Date | undefined) {
        super.data = newUndefinableDate(value);
    }
}
export class DateCorrectnessTableValue extends BaseDateCorrectnessTableValue {
    protected createTextFormattableValue() {
        return new DateTextFormattableValue(this.data);
    }
}

export class DateTimeCorrectnessTableValue extends BaseDateCorrectnessTableValue {
    protected createTextFormattableValue() {
        return new DateTimeTextFormattableValue(this.data);
    }
}

export abstract class BaseSourceTzOffsetDateTimeCorrectnessTableValue
        extends GenericCorrectnessTableValue<SourceTzOffsetDateTime> {

    override get data() { return super.data; }
    override set data(value: SourceTzOffsetDateTime | undefined) {
        super.data = SourceTzOffsetDateTime.newUndefinable(value);
    }
}
export class SourceTzOffsetDateTimeCorrectnessTableValue extends BaseSourceTzOffsetDateTimeCorrectnessTableValue {
    protected createTextFormattableValue() {
        return new SourceTzOffsetDateTimeTextFormattableValue(this.data);
    }
}
export class SourceTzOffsetDateTimeDateCorrectnessTableValue extends BaseSourceTzOffsetDateTimeCorrectnessTableValue {
    protected createTextFormattableValue() {
        return new SourceTzOffsetDateTimeDateTextFormattableValue(this.data);
    }
}
export class SourceTzOffsetDateCorrectnessTableValue extends GenericCorrectnessTableValue<SourceTzOffsetDate> {
    override get data() { return super.data; }
    override set data(value: SourceTzOffsetDate | undefined) {
        super.data = SourceTzOffsetDate.newUndefinable(value);
    }

    protected createTextFormattableValue() {
        return new SourceTzOffsetDateTextFormattableValue(this.data);
    }
}
export class IvemIdCorrectnessTableValue extends GenericCorrectnessTableValue<IvemId> {
    override get data() { return super.data; }
    override set data(value: IvemId | undefined) {
        super.data = value?.createCopy();
    }

    protected createTextFormattableValue() {
        return new IvemIdTextFormattableValue(this.data);
    }
}
export class DataIvemIdCorrectnessTableValue extends GenericCorrectnessTableValue<DataIvemId> {
    override get data() { return super.data; }
    override set data(value: DataIvemId | undefined) {
        super.data = value?.createCopy();
    }

    protected createTextFormattableValue() {
        return new DataIvemIdTextFormattableValue(this.data);
    }
}

export abstract class BooleanCorrectnessTableValue extends GenericCorrectnessTableValue<boolean> {
    protected textFormattableValueTypeId: TextFormattableValue.TypeId;

    protected createTextFormattableValue() {
        return new BooleanTextFormattableValue(this.data, this.textFormattableValueTypeId);
    }
}
export class RenderBooleanCorrectnessTableValue extends BooleanCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.RenderBoolean;
    }
}
export class EnabledCorrectnessTableValue extends BooleanCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Enabled;
    }
}
export class ModifiedCorrectnessTableValue extends BooleanCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Modified;
    }
}
export class IsIndexCorrectnessTableValue extends BooleanCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.IsIndex;
    }
}
export class UndisclosedCorrectnessTableValue extends BooleanCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Undisclosed;
    }
}
export class PhysicalDeliveryCorrectnessTableValue extends BooleanCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.PhysicalDelivery;
    }
}
export class WritableCorrectnessTableValue extends BooleanCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Writable;
    }
}
export class ReadonlyCorrectnessTableValue extends BooleanCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.Readonly;
    }
}

export abstract class BaseDecimalCorrectnessTableValue extends GenericCorrectnessTableValue<Decimal> {
    // protected createTextFormattableValue() {
    //     return new DecimalTextFormattableValue(this.data);
    // }

    override get data() { return super.data; }

    override set data(value: Decimal | undefined) {
        super.data = newUndefinableDecimal(value);
    }
}
export class DecimalCorrectnessTableValue extends BaseDecimalCorrectnessTableValue {
    protected createTextFormattableValue() {
        return new DecimalTextFormattableValue(this.data);
    }
}
export class PriceCorrectnessTableValue extends BaseDecimalCorrectnessTableValue {
    protected createTextFormattableValue() {
        return new PriceTextFormattableValue(this.data);
    }
}

export abstract class EnumCorrectnessTableValue extends GenericCorrectnessTableValue<Integer> {
    protected textFormattableValueTypeId: TextFormattableValue.TypeId;

    protected createTextFormattableValue() {
        return new EnumTextFormattableValue(this.data, this.textFormattableValueTypeId);
    }
}
export class TradingStateReasonIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.TradingStateReasonId;
    }
}
export class CallOrPutCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.CallOrPutId;
    }
}
export class CurrencyIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.CurrencyId;
    }
}
export class OrderSideIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderSideId;
    }
}
export class OrderTradeTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderTradeTypeId;
    }
}
export class OrderTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderTypeId;
    }
}
export class TimeInForceIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.TimeInForceId;
    }
}
export class OrderShortSellTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderShortSellTypeId;
    }
}
export class OrderPriceUnitTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderPriceUnitTypeId;
    }
}
export class OrderRouteAlgorithmIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderRouteAlgorithmId;
    }
}
export class OrderTriggerTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderTriggerTypeId;
    }
}
export class GridOrderTriggerTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.GridOrderTriggerTypeId;
    }
}
export class TrailingStopLossOrderConditionTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.TrailingStopLossOrderConditionTypeId;
    }
}
export class FeedStatusIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.FeedStatusId;
    }
}
export class FeedClassIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.FeedClassId;
    }
}
export class IvemClassIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.IvemClassId;
    }
}
export class DepthDirectionIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.DepthDirectionId;
    }
}
export class ExerciseTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.ExerciseTypeId;
    }
}
export class CallOrPutIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.CallOrPutId;
    }
}
export class MarketClassificationIdMyxDataIvemAttributeCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.MarketClassificationIdMyxDataIvemAttribute;
    }
}
export class DeliveryBasisIdMyxDataIvemAttributeCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.DeliveryBasisIdMyxDataIvemAttribute;
    }
}
export class ScanTargetTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.ScanTargetTypeId;
    }
}
export class ActiveFaultedStatusIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.ActiveFaultedStatusId;
    }
}
export class RankedDataIvemIdListDirectoryItemTypeIdCorrectnessTableValue extends EnumCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.RankedDataIvemIdListDirectoryItemTypeId;
    }
}

export class StringArrayCorrectnessTableValue extends GenericCorrectnessTableValue<readonly string[]> {
    protected createTextFormattableValue() {
        return new StringArrayTextFormattableValue(this.data);
    }
}

export abstract class BaseIntegerArrayCorrectnessTableValue extends GenericCorrectnessTableValue<readonly Integer[]> {
    protected textFormattableValueTypeId: TextFormattableValue.TypeId;

    protected createTextFormattableValue() {
        return new IntegerArrayTextFormattableValue(this.data, this.textFormattableValueTypeId);
    }
}

export class IntegerArrayCorrectnessTableValue extends BaseIntegerArrayCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.IntegerArray;
    }
}

export class TradingStateAllowIdArrayCorrectnessTableValue extends BaseIntegerArrayCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.TradingStateAllowIdArray;
    }
}

export class OrderStatusAllowIdArrayCorrectnessTableValue extends BaseIntegerArrayCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderStatusAllowIdArray;
    }
}

export class OrderStatusReasonIdArrayCorrectnessTableValue extends BaseIntegerArrayCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.OrderStatusReasonIdArray;
    }
}

export class PublisherSubscriptionDataTypeIdArrayCorrectnessTableValue extends BaseIntegerArrayCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.PublisherSubscriptionDataTypeIdArray;
    }
}

export class ShortSellTypeIdArrayMyxDataIvemAttributeCorrectnessTableValue extends BaseIntegerArrayCorrectnessTableValue {
    constructor() {
        super();
        this.textFormattableValueTypeId = TextFormattableValue.TypeId.ShortSellTypeIdArrayMyxDataIvemAttribute;
    }
}
