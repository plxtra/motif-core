import { DecimalFactory, Integer, MultiEvent, UnreachableCaseError } from '@pbkware/js-utils';
import { Order } from '../../../adi/internal-api';
import { FactoryisedDecimal } from '../../../services/internal-api';
import { OrderTableFieldSourceDefinition } from '../field-source/definition/internal-api';
import {
    BooleanCorrectnessTableValue,
    CorrectnessTableValue,
    DecimalCorrectnessTableValue,
    EnumCorrectnessTableValue,
    IntegerCorrectnessTableValue,
    OrderStatusAllowIdArrayCorrectnessTableValue,
    OrderStatusReasonIdArrayCorrectnessTableValue,
    PriceCorrectnessTableValue,
    SourceTzOffsetDateTimeDateCorrectnessTableValue,
    StringArrayCorrectnessTableValue,
    StringCorrectnessTableValue,
    TableValue
} from '../value/internal-api';
import { CorrectnessTableValueSource } from './correctness-table-value-source';
import { TableValueSource } from './table-value-source';

export class OrderTableValueSource extends CorrectnessTableValueSource<Order> {
    private _orderChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        firstFieldIndexOffset: Integer,
        private readonly _order: Order
    ) {
        super(firstFieldIndexOffset);
    }

    override activate() {
        this._orderChangedEventSubscriptionId = this._order.subscribeChangedEvent(
            (valueChanges) => { this.handleOrderChangedEvent(valueChanges); }
        );

        return super.activate();
    }

    override deactivate() {
        this._order.unsubscribeChangedEvent(this._orderChangedEventSubscriptionId);
        this._orderChangedEventSubscriptionId = undefined;

        super.deactivate();
    }

    getAllValues(): TableValue[] {
        const fieldCount = OrderTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = OrderTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getRecord() {
        return this._order;
    }

    protected getfieldCount(): Integer {
        return OrderTableFieldSourceDefinition.Field.count;
    }

    private handleOrderChangedEvent(orderValueChanges: Order.ValueChange[]) {
        const changedFieldCount = orderValueChanges.length;
        const valueChanges = new Array<TableValueSource.ValueChange>(changedFieldCount);
        let foundCount = 0;
        for (let i = 0; i < changedFieldCount; i++) {
            const { fieldId, recentChangeTypeId } = orderValueChanges[i];
            const fieldIndex = OrderTableFieldSourceDefinition.Field.indexOfId(fieldId);
            if (fieldIndex >= 0) {
                const newValue = this.createTableValue(fieldIndex);
                this.loadValue(fieldId, newValue);
                valueChanges[foundCount++] = { fieldIndex, newValue, recentChangeTypeId };
            }
        }
        if (foundCount < changedFieldCount) {
            valueChanges.length = foundCount;
        }
        this.notifyValueChangesEvent(valueChanges);
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = OrderTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: Order.FieldId, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this._order.correctnessId;

        switch (id) {
            case Order.FieldId.Id:
                (value as StringCorrectnessTableValue).data = this._order.id;
                break;
            case Order.FieldId.AccountId:
                (value as StringCorrectnessTableValue).data = this._order.account.id.display;
                break;
            case Order.FieldId.ExternalId:
                (value as StringCorrectnessTableValue).data = this._order.externalId;
                break;
            case Order.FieldId.DepthOrderId:
                (value as StringCorrectnessTableValue).data = this._order.depthOrderId;
                break;
            case Order.FieldId.Status:
                (value as StringCorrectnessTableValue).data = this._order.status;
                break;
            case Order.FieldId.StatusAllowIds:
                (value as OrderStatusAllowIdArrayCorrectnessTableValue).data = this._order.statusAllowIds;
                break;
            case Order.FieldId.StatusReasonIds:
                (value as OrderStatusReasonIdArrayCorrectnessTableValue).data = this._order.statusReasonIds;
                break;
            case Order.FieldId.TradingMarket:
                (value as StringCorrectnessTableValue).data = this._order.marketDisplay;
                break;
            case Order.FieldId.CurrencyId:
                (value as EnumCorrectnessTableValue).data = this._order.currencyId;
                break;
            case Order.FieldId.EstimatedBrokerage: {
                const estimatedBrokerage = this._order.estimatedBrokerage;
                const factoryisedEstimatedBrokerage = estimatedBrokerage === undefined ? undefined : new FactoryisedDecimal(this._decimalFactory, estimatedBrokerage);
                (value as PriceCorrectnessTableValue).data = factoryisedEstimatedBrokerage;
                break;
            }
            case Order.FieldId.CurrentBrokerage: {
                const currentBrokerage = this._order.currentBrokerage;
                const factoryisedCurrentBrokerage = currentBrokerage === undefined ? undefined : new FactoryisedDecimal(this._decimalFactory, currentBrokerage);
                (value as PriceCorrectnessTableValue).data = factoryisedCurrentBrokerage;
                break;
            }
            case Order.FieldId.EstimatedTax: {
                const estimatedTax = this._order.estimatedTax;
                const factoryisedEstimatedTax = estimatedTax === undefined ? undefined : new FactoryisedDecimal(this._decimalFactory, estimatedTax);
                (value as PriceCorrectnessTableValue).data = factoryisedEstimatedTax;
                break;
            }
            case Order.FieldId.CurrentTax: {
                const currentTax = this._order.currentTax;
                const factoryisedCurrentTax = currentTax === undefined ? undefined : new FactoryisedDecimal(this._decimalFactory, currentTax);
                (value as PriceCorrectnessTableValue).data = factoryisedCurrentTax;
                break;
            }
            case Order.FieldId.CurrentValue: {
                const factoryisedCurrentValue = new FactoryisedDecimal(this._decimalFactory, this._order.currentValue);
                (value as DecimalCorrectnessTableValue).data = factoryisedCurrentValue;
                break;
            }
            case Order.FieldId.CreatedDate:
                // (value as SourceTzOffsetDateTimeCorrectnessTableValue).data = this._order.createdDate;
                (value as SourceTzOffsetDateTimeDateCorrectnessTableValue).data = this._order.createdDate;
                break;
            case Order.FieldId.UpdatedDate:
                // (value as SourceTzOffsetDateTimeCorrectnessTableValue).data = this._order.updatedDate;
                (value as SourceTzOffsetDateTimeDateCorrectnessTableValue).data = this._order.updatedDate;
                break;
            case Order.FieldId.StyleId:
                (value as EnumCorrectnessTableValue).data = this._order.styleId;
                break;
            case Order.FieldId.Children:
                (value as StringArrayCorrectnessTableValue).data =
                    this._order.children === undefined ? undefined : this._order.children.slice();
                break;
            case Order.FieldId.ExecutedQuantity:
                (value as IntegerCorrectnessTableValue).data = this._order.executedQuantity;
                break;
            case Order.FieldId.AveragePrice: {
                const averagePrice = this._order.averagePrice;
                const factoryisedAveragePrice = averagePrice === undefined ? undefined : new FactoryisedDecimal(this._decimalFactory, averagePrice);
                (value as PriceCorrectnessTableValue).data = factoryisedAveragePrice;
                break;
            }
            case Order.FieldId.Exchange:
                (value as StringCorrectnessTableValue).data = this._order.exchange.abbreviatedDisplay;
                break;
            case Order.FieldId.Code:
                (value as StringCorrectnessTableValue).data = this._order.code;
                break;
            case Order.FieldId.SideId:
                (value as EnumCorrectnessTableValue).data = this._order.sideId;
                break;
            case Order.FieldId.ExtendedSideId:
                (value as EnumCorrectnessTableValue).data = this._order.tradeTypeId;
                break;
            case Order.FieldId.BrokerageSchedule:
                (value as StringCorrectnessTableValue).data = this._order.brokerageSchedule;
                break;
            case Order.FieldId.EquityOrderTypeId:
                (value as EnumCorrectnessTableValue).data = this._order.equityOrderTypeId;
                break;
            case Order.FieldId.LimitPrice: {
                const limitPrice = this._order.limitPrice;
                const factoryisedLimitPrice = limitPrice === undefined ? undefined : new FactoryisedDecimal(this._decimalFactory, limitPrice);
                (value as PriceCorrectnessTableValue).data = factoryisedLimitPrice;
                break;
            }
            case Order.FieldId.Quantity:
                (value as IntegerCorrectnessTableValue).data = this._order.quantity;
                break;
            case Order.FieldId.HiddenQuantity:
                (value as IntegerCorrectnessTableValue).data = this._order.hiddenQuantity;
                break;
            case Order.FieldId.MinimumQuantity:
                (value as IntegerCorrectnessTableValue).data = this._order.minimumQuantity;
                break;
            case Order.FieldId.TimeInForceId:
                (value as EnumCorrectnessTableValue).data = this._order.timeInForceId;
                break;
            case Order.FieldId.ExpiryDate:
                (value as SourceTzOffsetDateTimeDateCorrectnessTableValue).data = this._order.expiryDate;
                break;
            case Order.FieldId.ShortSellTypeId:
                (value as EnumCorrectnessTableValue).data = this._order.shortSellTypeId;
                break;
            case Order.FieldId.UnitTypeId:
                (value as EnumCorrectnessTableValue).data = this._order.unitTypeId;
                break;
            case Order.FieldId.UnitAmount: {
                const decimalValue = this._order.limitPrice;
                const factoryisedDecimalValue = decimalValue === undefined ? undefined : new FactoryisedDecimal(this._decimalFactory, decimalValue);
                (value as DecimalCorrectnessTableValue).data = factoryisedDecimalValue;
                break;
            }
            case Order.FieldId.ManagedFundCurrency:
                (value as StringCorrectnessTableValue).data = this._order.managedFundCurrency;
                break;
            case Order.FieldId.PhysicalDelivery:
                (value as BooleanCorrectnessTableValue).data = this._order.physicalDelivery;
                break;
            case Order.FieldId.RouteAlgorithmId:
                (value as EnumCorrectnessTableValue).data = this._order.routeAlgorithmId;
                break;
            case Order.FieldId.RouteMarket:
                (value as StringCorrectnessTableValue).data = this._order.routeMarket?.display;
                break;
            case Order.FieldId.TriggerTypeId:
                (value as EnumCorrectnessTableValue).data = this._order.triggerTypeId;
                break;
            case Order.FieldId.TriggerValue: {
                const triggerValue = this._order.triggerValue;
                const factoryisedTriggerValue = triggerValue === undefined ? undefined : new FactoryisedDecimal(this._decimalFactory, triggerValue);
                (value as PriceCorrectnessTableValue).data = factoryisedTriggerValue;
                break;
            }
            case Order.FieldId.TriggerExtraParams:
                (value as StringCorrectnessTableValue).data = this._order.triggerExtraParamsText;
                break;

            default:
                throw new UnreachableCaseError('BATVSLV9473', id);
        }
    }
}
