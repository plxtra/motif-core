import {
    AssertInternalError,
    DecimalFactory,
    EnumInfoOutOfOrderError,
    Integer,
    MapKey,
    MultiEvent,
    SourceTzOffsetDateTime,
    isArrayEqualUniquely,
    isDecimalEqual,
    isSamePossiblyUndefinedArray,
    isUndefinableDecimalEqual,
} from '@pbkware/js-utils';
import { Decimal } from 'decimal.js-light';
import { RevRecordValueRecentChangeTypeId } from 'revgrid';
import { StringId, Strings } from '../res';
import {
    CorrectnessId,
    ErrorCode,
    FieldDataTypeId,
    ZenithDataError,
} from '../sys';
import { BrokerageAccount } from './brokerage-account';
import { BrokerageAccountRecord } from './brokerage-account-record';
import {
    Currency,
    CurrencyId,
    ImmediateOrderTrigger,
    IvemClassId,
    MarketOrderRoute,
    OrderId,
    OrderInstructionId,
    OrderPriceUnitType,
    OrderPriceUnitTypeId,
    OrderRoute,
    OrderRouteAlgorithmId,
    OrderShortSellTypeId,
    OrderSide,
    OrderSideId,
    OrderStatus,
    OrderStatuses,
    OrderTradeType,
    OrderTradeTypeId,
    OrderTrigger,
    OrderTriggerTypeId,
    OrderTypeId,
    OrdersDataMessage,
    TimeInForce,
    TimeInForceId
} from './common/internal-api';
import { Exchange, MarketsService, TradingMarket } from './markets/internal-api';
import { IvemId, TradingIvemId } from './symbol-id/internal-api';

export class Order implements BrokerageAccountRecord {
    private _destroyed = false;

    private _id: OrderId;
    private readonly _accountZenithCode: string;
    private _externalId: string | undefined;
    private _depthOrderId: string | undefined;
    private _tradingMarket: TradingMarket;
    private _currencyId: CurrencyId | undefined;
    private _estimatedBrokerage: Decimal | undefined;
    private _currentBrokerage: Decimal | undefined;
    private _estimatedTax: Decimal | undefined;
    private _currentTax: Decimal | undefined;
    private _currentValue: Decimal;
    private _createdDate: SourceTzOffsetDateTime;
    private _updatedDate: SourceTzOffsetDateTime;
    private _children: string[] | undefined;
    private _executedQuantity: Integer;
    private _averagePrice: Decimal | undefined;
    // details
    private _styleId: IvemClassId;
    private _exchange: Exchange;
    // private _environmentId: TradingEnvironmentId;
    private _code: string;
    private _sideId: OrderSideId;
    private _tradeTypeId: OrderTradeTypeId;
    private _brokerageSchedule: string | undefined;
    // equity details
    private _equityOrderTypeId: OrderTypeId;
    private _limitPrice: Decimal | undefined;
    private _quantity: Integer;
    private _hiddenQuantity: Integer | undefined;
    private _minimumQuantity: Integer | undefined;
    private _timeInForceId: TimeInForceId;
    private _expiryDate: SourceTzOffsetDateTime | undefined;
    private _shortSellTypeId: OrderShortSellTypeId | undefined;
    // managed fund details
    private _unitTypeId: OrderPriceUnitTypeId | undefined;
    private _unitAmount: Decimal | undefined;
    private _managedFundCurrency: string | undefined;
    private _physicalDelivery: boolean | undefined;
    // route
    private _marketZenithCode: string;
    private _orderRoute: OrderRoute;
    private _orderRouteTradingMarket: TradingMarket | undefined;
    // condition
    private _trigger: OrderTrigger;

    private _status: string;
    private _statusAllowIds: OrderStatus.AllowIds = [];
    private _statusReasonIds: OrderStatus.ReasonIds = [];

    private _mapKey: MapKey | undefined;

    private _changedMultiEvent = new MultiEvent<Order.ChangedEventHandler>();
    private _correctnessChangedMultiEvent = new MultiEvent<Order.CorrectnessChangedEventHandler>();

    constructor(
        private readonly _marketsService: MarketsService,
        private readonly _account: BrokerageAccount,
        change: OrdersDataMessage.AddChange,
        private _correctnessId: CorrectnessId
    ) {
        this._id = change.id;
        this._accountZenithCode = change.accountZenithCode;
        this._externalId = change.externalId;
        this._depthOrderId = change.depthOrderId;
        const tradingMarket = this._marketsService.getTradingMarketOrUnknown(change.tradingMarketZenithCode);
        this._tradingMarket = tradingMarket;
        this._currencyId = change.currencyId;
        this._estimatedBrokerage = change.estimatedBrokerage;
        this._currentBrokerage = change.currentBrokerage;
        this._estimatedTax = change.estimatedTax;
        this._currentTax = change.currentTax;
        this._currentValue = change.currentValue;
        this._createdDate = change.createdDate;
        this._updatedDate = change.updatedDate;
        this._children = change.children;
        this._executedQuantity = change.executedQuantity;
        if (change.averagePrice === null) {
            this._averagePrice = undefined;
        } else {
            this._averagePrice = change.averagePrice;
        }
        // this._exchangeId = change.exchangeZenithCode;
        const exchange = this._marketsService.getExchangeOrUnknown(change.exchangeZenithCode);
        this._exchange = exchange;
        this._code = change.code;
        this._sideId = change.sideId;
        this._brokerageSchedule = change.brokerageSchedule;
        this._equityOrderTypeId = change.equityOrderTypeId;
        this._limitPrice = change.limitPrice;
        this._quantity = change.quantity;
        this._hiddenQuantity = change.hiddenQuantity;
        this._minimumQuantity = change.minimumQuantity;
        this._timeInForceId = change.timeInForceId;
        this._expiryDate = change.expiryDate;
        this._shortSellTypeId = change.shortSellTypeId;
        this._unitTypeId = change.unitTypeId;
        this._unitAmount = change.unitAmount;
        this._managedFundCurrency = change.managedFundCurrency;
        this._physicalDelivery = change.physicalDelivery;
        this.updateOrderRoute(change.route);
        this._trigger = change.trigger;
        this._tradeTypeId = this.calculateExtendedSideId(change.instructionIds);

        this.setStatus(change.status);
    }

    get destroyed(): boolean { return this._destroyed; }

    get account() { return this._account; }

    get id() { return this._id; }
    get accountZenithCode() { return this._accountZenithCode; }
    get externalId() { return this._externalId; }
    get depthOrderId() { return this._depthOrderId; }
    get marketDisplay() { return this._tradingMarket.display; }
    get tradingMarket() { return this._tradingMarket; }
    get currencyId() { return this._currencyId; }
    get estimatedBrokerage(): Decimal | undefined { return this._estimatedBrokerage; }
    get currentBrokerage(): Decimal | undefined { return this._currentBrokerage; }
    get estimatedTax(): Decimal | undefined { return this._estimatedTax; }
    get currentTax(): Decimal | undefined { return this._currentTax; }
    get currentValue(): Decimal { return this._currentValue; }
    get createdDate() { return this._createdDate; }
    get updatedDate() { return this._updatedDate; }
    get children() { return this._children; }
    get executedQuantity() { return this._executedQuantity; }
    get averagePrice(): Decimal | undefined { return this._averagePrice; }
    get styleId(): IvemClassId { return this._styleId; }
    get exchange(): Exchange {
        const exchange = this._exchange;
        if (!exchange.destroyed) {
            return exchange;
        } else {
            const foundExchange = this._marketsService.exchanges.findZenithCode(exchange.zenithCode);
            if (foundExchange === undefined) {
                throw new AssertInternalError('OTE33123', exchange.zenithCode); // Exchanges can be replaced but not removed
            } else {
                this._exchange = foundExchange;
                return foundExchange;
            }
        }
    }
    // get environmentId() { return this._environmentId; }
    get code() { return this._code; }
    get sideId() { return this._sideId; }
    get tradeTypeId() { return this._tradeTypeId; }
    get brokerageSchedule() { return this._brokerageSchedule; }
    get equityOrderTypeId() { return this._equityOrderTypeId; }
    get limitPrice(): Decimal | undefined { return this._limitPrice; }
    get quantity() { return this._quantity; }
    get hiddenQuantity() { return this._hiddenQuantity; }
    get minimumQuantity() { return this._minimumQuantity; }
    get timeInForceId() { return this._timeInForceId; }
    get expiryDate() { return this._expiryDate; }
    get shortSellTypeId() { return this._shortSellTypeId; }
    get unitTypeId() { return this._unitTypeId; }
    get unitAmount(): Decimal | undefined { return this._unitAmount; }
    get managedFundCurrency() { return this._managedFundCurrency; }
    get physicalDelivery() { return this._physicalDelivery; }
    get trigger() { return this._trigger; }

    get status() { return this._status; }
    get statusAllowIds() { return this._statusAllowIds; }
    get statusReasonIds() { return this._statusReasonIds; }

    get correctnessId() { return this._correctnessId; }

    get mapKey() {
        if (this._mapKey === undefined) {
            this._mapKey = Order.generateMapKey(this.id, this.accountZenithCode);
        }
        return this._mapKey;
    }
    get accountMapKey() { return this._account.mapKey; }

    get tradingIvemId(): TradingIvemId {
        return new TradingIvemId(this._code, this._tradingMarket);
    }
    get ivemId(): IvemId {
        return new IvemId(this._code, this.exchange);
    }

    get routeAlgorithmId(): OrderRouteAlgorithmId {
        return this._orderRoute.algorithmId;
    }

    get routeMarket(): TradingMarket | undefined { return this._orderRouteTradingMarket; }

    get triggerTypeId(): OrderTriggerTypeId {
        return this.trigger.typeId;
    }

    get triggerValue(): Decimal | undefined {
        return this.trigger.value;
    }
    get triggerExtraParamsText() {
        return this.trigger.extraParamsText;
    }

    destroy() {
        this._destroyed = true;
    }

    // createKey(): Order.Key {
    //     return new Order.Key(this.id, this.accountZenithCode);
    // }

    setListCorrectness(value: CorrectnessId) {
        if (value !== this._correctnessId) {
            this._correctnessId = value;
            this.notifyCorrectnessChanged();
        }
    }

    update(change: OrdersDataMessage.AddUpdateChange) {
        const valueChanges = new Array<Order.ValueChange>(Order.Field.count);
        let changedIdx = 0;

        if (change.id !== this._id) {
            this._id = change.id;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.Id, recentChangeTypeId: undefined };
        }

        if (change.accountZenithCode !== this._accountZenithCode) {
            throw new ZenithDataError(ErrorCode.Order_Update_AccountZenithCodeChangeNotAllowed, JSON.stringify(change));
        }

        if (change.externalId !== this._externalId) {
            this._externalId = change.externalId;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.ExternalId, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (change.depthOrderId !== this._depthOrderId) {
            this._depthOrderId = change.depthOrderId;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.DepthOrderId,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.status !== this._status) {
            const allowReasonChangedFieldIds = this.setStatus(change.status);
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.Status, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
            for (const fieldId of allowReasonChangedFieldIds) {
                valueChanges[changedIdx++] = {
                    fieldId,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
        }

        if (change.tradingMarketZenithCode !== this._tradingMarket.zenithCode) {
            this._tradingMarket = this._marketsService.getTradingMarketOrUnknown(change.tradingMarketZenithCode);
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.TradingMarket,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.currencyId !== this._currencyId) {
            this._currencyId = change.currencyId;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.CurrencyId, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (!isUndefinableDecimalEqual(change.estimatedBrokerage, this._estimatedBrokerage)) {
            this._estimatedBrokerage = change.estimatedBrokerage;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.EstimatedBrokerage,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (!isUndefinableDecimalEqual(change.currentBrokerage, this._currentBrokerage)) {
            this._currentBrokerage = change.currentBrokerage;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.CurrentBrokerage,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (!isUndefinableDecimalEqual(change.estimatedTax, this._estimatedTax)) {
            this._estimatedTax = change.estimatedTax;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.EstimatedTax,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (!isUndefinableDecimalEqual(change.currentTax, this._currentTax)) {
            this._currentTax = change.currentTax;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.CurrentTax, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (!isUndefinableDecimalEqual(change.currentValue, this._currentValue)) {
            this._currentValue = change.currentValue;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.CurrentValue,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.createdDate !== this._createdDate) {
            this._createdDate = change.createdDate;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.CreatedDate,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.updatedDate !== this._updatedDate) {
            this._updatedDate = change.updatedDate;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.UpdatedDate,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.styleId !== this._styleId) {
            this._styleId = change.styleId;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.StyleId, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (!isSamePossiblyUndefinedArray<string>(change.children, this._children)) {
            this._children = change.children;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.Children, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (change.executedQuantity !== this._executedQuantity) {
            this._executedQuantity = change.executedQuantity;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.ExecutedQuantity,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.averagePrice !== undefined) {
            if (change.averagePrice === null) {
                if (this._averagePrice !== undefined) {
                    this._averagePrice = undefined;
                    valueChanges[changedIdx++] = {
                        fieldId: Order.FieldId.AveragePrice,
                        recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                    };
                }
            } else {
                if (this._averagePrice === undefined || !isDecimalEqual(change.averagePrice, this._averagePrice)) {
                    this._averagePrice = change.averagePrice;
                    valueChanges[changedIdx++] = {
                        fieldId: Order.FieldId.AveragePrice,
                        recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                    };
                }
            }
        }

        if (change.exchangeZenithCode !== this.exchange.zenithCode) {
            throw new ZenithDataError(ErrorCode.Order_Update_ExchangeZenithCodeChangeNotAllowed, JSON.stringify(change));
        }

        // if (change.zenithTradingEnvironmentCode !== this._environmentId) {
        //     this._environmentId = change.zenithTradingEnvironmentCode;
        //     valueChanges[changedIdx++] = {
        //         fieldId: Order.FieldId.EnvironmentId,
        //         recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
        //     };
        // }

        if (change.code !== this._code) {
            this._code = change.code;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.Code, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (change.sideId !== this._sideId) {
            this._sideId = change.sideId;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.SideId, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (change.brokerageSchedule !== this._brokerageSchedule) {
            this._brokerageSchedule = change.brokerageSchedule;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.BrokerageSchedule,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.equityOrderTypeId !== this._equityOrderTypeId) {
            this._equityOrderTypeId = change.equityOrderTypeId;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.EquityOrderTypeId,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.limitPrice === undefined) {
            if (this._limitPrice !== undefined) {
                this._limitPrice = undefined;
                valueChanges[changedIdx++] = {
                    fieldId: Order.FieldId.LimitPrice,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
        } else {
            if (this._limitPrice === undefined || !isDecimalEqual(change.limitPrice, this._limitPrice)) {
                this._limitPrice = change.limitPrice;
                valueChanges[changedIdx++] = {
                    fieldId: Order.FieldId.LimitPrice,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
        }

        if (change.quantity !== this._quantity) {
            this._quantity = change.quantity;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.Quantity, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (change.hiddenQuantity !== this._hiddenQuantity) {
            this._hiddenQuantity = change.hiddenQuantity;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.HiddenQuantity,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.minimumQuantity !== this._minimumQuantity) {
            this._minimumQuantity = change.minimumQuantity;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.MinimumQuantity,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.timeInForceId !== this._timeInForceId) {
            this._timeInForceId = change.timeInForceId;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.TimeInForceId,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (!SourceTzOffsetDateTime.isUndefinableEqual(change.expiryDate, this._expiryDate)) {
            this._expiryDate = change.expiryDate;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.ExpiryDate, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (change.shortSellTypeId !== this._shortSellTypeId) {
            this._shortSellTypeId = change.shortSellTypeId;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.ShortSellTypeId, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (change.unitTypeId !== this._unitTypeId) {
            this._unitTypeId = change.unitTypeId;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.UnitTypeId, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (!isUndefinableDecimalEqual(change.unitAmount, this._unitAmount)) {
            this._unitAmount = change.unitAmount;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.UnitAmount, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (change.managedFundCurrency !== this._managedFundCurrency) {
            this._managedFundCurrency = change.managedFundCurrency;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.ManagedFundCurrency,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        if (change.physicalDelivery !== this._physicalDelivery) {
            this._physicalDelivery = change.physicalDelivery;
            valueChanges[changedIdx++] = {
                fieldId: Order.FieldId.PhysicalDelivery,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        const route = change.route;
        if (!OrderRoute.isEqual(route, this._orderRoute)) {
            const oldRoute = this._orderRoute;
            const oldTradingMarket = this._orderRouteTradingMarket;
            this.updateOrderRoute(route);
            if (oldRoute.algorithmId !== route.algorithmId) {
                valueChanges[changedIdx++] = { fieldId: Order.FieldId.RouteAlgorithmId, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
            }
            if (oldTradingMarket !== this._orderRouteTradingMarket) {
                valueChanges[changedIdx++] = { fieldId: Order.FieldId.RouteMarket, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
            }
        }

        if (!OrderTrigger.isEqual(change.trigger, this._trigger)) {
            const oldTriggerTypeId = this.triggerTypeId;
            const oldTriggerValue = this.triggerValue;
            const oldTriggerExtraParamsText = this.triggerExtraParamsText;
            this._trigger = change.trigger;
            if (this.triggerTypeId !== oldTriggerTypeId) {
                valueChanges[changedIdx++] = {
                    fieldId: Order.FieldId.TriggerTypeId,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
            if (this.triggerValue !== oldTriggerValue) {
                valueChanges[changedIdx++] = {
                    fieldId: Order.FieldId.TriggerValue,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
            if (this.triggerExtraParamsText !== oldTriggerExtraParamsText) {
                valueChanges[changedIdx++] = {
                    fieldId: Order.FieldId.TriggerExtraParams,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
        }

        const newExtendedSideId = this.calculateExtendedSideId(change.instructionIds);

        if (newExtendedSideId !== this._tradeTypeId) {
            this._tradeTypeId = newExtendedSideId;
            valueChanges[changedIdx++] = { fieldId: Order.FieldId.ExtendedSideId, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
        }

        if (changedIdx >= 0) {
            valueChanges.length = changedIdx;
            this.notifyChanged(valueChanges);
        }
    }

    canTrade() {
        return this.statusAllowIds.includes(OrderStatus.AllowId.Trade);
    }

    canAmend() {
        return this.statusAllowIds.includes(OrderStatus.AllowId.Amend);
    }

    canCancel() {
        return this.statusAllowIds.includes(OrderStatus.AllowId.Cancel);
    }

    canMove() {
        return this.statusAllowIds.includes(OrderStatus.AllowId.Move);
    }

    generateMapKey(): MapKey {
        return Order.generateMapKey(this.id, this.accountZenithCode);
    }

    subscribeChangedEvent(handler: Order.ChangedEventHandler) {
        return this._changedMultiEvent.subscribe(handler);
    }

    unsubscribeChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._changedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeCorrectnessChangedEvent(handler: Order.CorrectnessChangedEventHandler) {
        return this._correctnessChangedMultiEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._correctnessChangedMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyChanged(valueChanges: Order.ValueChange[]) {
        const handlers = this._changedMultiEvent.copyHandlers();
        for (let index = 0; index < handlers.length; index++) {
            handlers[index](valueChanges);
        }
    }

    private notifyCorrectnessChanged() {
        const handlers = this._correctnessChangedMultiEvent.copyHandlers();
        for (let index = 0; index < handlers.length; index++) {
            handlers[index]();
        }
    }

    private setStatus(value: string) {
        if (value === this._status) {
            return [];
        } else {
            this._status = value;
            return this.updateStatusAllowReasonIds();
        }
    }

    private calculateExtendedSideId(instructionIds: OrderInstructionId[]) {
        return OrderTradeType.calculateFromSideExchangeShortSellInstuctions(
            this._sideId,
            this.exchange.unenvironmentedZenithCode,
            this._shortSellTypeId,
            instructionIds
        );
    }

    private updateStatusAllowReasonIds() {
        let statusAllowIds: OrderStatus.AllowIds;
        let statusReasonIds: OrderStatus.ReasonIds;

        const orderStatus = OrderStatuses.find(this._account.tradingFeed.orderStatuses, this.status);
        if (orderStatus === undefined) {
            statusAllowIds = [];
            statusReasonIds = [];
            window.motifLogger.logError(`OrderStatus not available for status: ${this.status} on account: ${this._account.zenithCode}`);
        } else {
            statusAllowIds = orderStatus.allowIds;
            statusReasonIds = orderStatus.reasonIds;
        }

        const result = new Array<Order.FieldId>(2);
        let fieldChangeCount = 0;

        if (!isArrayEqualUniquely(statusAllowIds, this.statusAllowIds)) {
            this._statusAllowIds = statusAllowIds;
            result[fieldChangeCount++] = Order.FieldId.StatusAllowIds;
        }
        if (!isArrayEqualUniquely(statusReasonIds, this.statusReasonIds)) {
            this._statusReasonIds = statusReasonIds;
            result[fieldChangeCount++] = Order.FieldId.StatusReasonIds;
        }

        result.length = fieldChangeCount;
        return result;
    }

    private updateOrderRoute(route: OrderRoute): void {
        this._orderRoute = route;
        if (OrderRoute.isMarket(route)) {
            this._orderRouteTradingMarket = this._marketsService.getTradingMarketOrUnknown(route.marketZenithCode);
        } else {
            this._orderRouteTradingMarket = undefined;
        }
    }
}

export namespace Order {
    export type Id = OrderId;
    export const NullId = '';

    export type ChangedEventHandler = (this: void, valueChanges: Order.ValueChange[]) => void;
    export type CorrectnessChangedEventHandler = (this: void) => void;

    export const enum FieldId {
        Id,
        AccountId,
        ExternalId,
        DepthOrderId,
        Status,
        StatusAllowIds,
        StatusReasonIds,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        TradingMarket,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        CurrencyId,
        EstimatedBrokerage,
        CurrentBrokerage,
        EstimatedTax,
        CurrentTax,
        CurrentValue,
        CreatedDate,
        UpdatedDate,
        StyleId,
        Children,
        ExecutedQuantity,
        AveragePrice,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        Exchange,
        // EnvironmentId,
        Code,
        SideId,
        ExtendedSideId,
        BrokerageSchedule,
        EquityOrderTypeId,
        LimitPrice,
        Quantity,
        HiddenQuantity,
        MinimumQuantity,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        TimeInForceId,
        ExpiryDate,
        ShortSellTypeId,
        UnitTypeId,
        UnitAmount,
        ManagedFundCurrency,
        PhysicalDelivery,
        RouteAlgorithmId,
        RouteMarket,
        TriggerTypeId,
        TriggerValue,
        TriggerExtraParams,
    }

    export namespace Field {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        export type Id = Order.FieldId;
        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfoObject = { [id in keyof typeof FieldId]: Info };

        const infoObject: InfoObject = {
            Id: {
                id: FieldId.Id,
                name: 'Id',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_Id,
                headingId: StringId.OrderFieldHeading_Id,
            },
            AccountId: {
                id: FieldId.AccountId,
                name: 'AccountId',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_AccountId,
                headingId: StringId.OrderFieldHeading_AccountId,
            },
            ExternalId: {
                id: FieldId.ExternalId,
                name: 'ExternalID',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_ExternalID,
                headingId: StringId.OrderFieldHeading_ExternalID,
            },
            DepthOrderId: {
                id: FieldId.DepthOrderId,
                name: 'DepthOrderID',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_DepthOrderID,
                headingId: StringId.OrderFieldHeading_DepthOrderID,
            },
            Status: {
                id: FieldId.Status,
                name: 'Status',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_Status,
                headingId: StringId.OrderFieldHeading_Status,
            },
            StatusAllowIds: {
                id: FieldId.StatusAllowIds,
                name: 'StatusAllowIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.OrderFieldDisplay_StatusAllowIds,
                headingId: StringId.OrderFieldHeading_StatusAllowIds,
            },
            StatusReasonIds: {
                id: FieldId.StatusReasonIds,
                name: 'StatusReasonIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.OrderFieldDisplay_StatusReasonIds,
                headingId: StringId.OrderFieldHeading_StatusReasonIds,
            },
            TradingMarket: {
                id: FieldId.TradingMarket,
                name: 'TradingMarket',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_TradingMarket,
                headingId: StringId.OrderFieldHeading_TradingMarket,
            },
            CurrencyId: {
                id: FieldId.CurrencyId,
                name: 'Currency',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_Currency,
                headingId: StringId.OrderFieldHeading_Currency,
            },
            EstimatedBrokerage: {
                id: FieldId.EstimatedBrokerage,
                name: 'EstimatedBrokerage',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_EstimatedBrokerage,
                headingId: StringId.OrderFieldHeading_EstimatedBrokerage,
            },
            CurrentBrokerage: {
                id: FieldId.CurrentBrokerage,
                name: 'CurrentBrokerage',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_CurrentBrokerage,
                headingId: StringId.OrderFieldHeading_CurrentBrokerage,
            },
            EstimatedTax: {
                id: FieldId.EstimatedTax,
                name: 'EstimatedTax',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_EstimatedTax,
                headingId: StringId.OrderFieldHeading_EstimatedTax,
            },
            CurrentTax: {
                id: FieldId.CurrentTax,
                name: 'CurrentTax',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_CurrentTax,
                headingId: StringId.OrderFieldHeading_CurrentTax,
            },
            CurrentValue: {
                id: FieldId.CurrentValue,
                name: 'CurrentValue',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_CurrentValue,
                headingId: StringId.OrderFieldHeading_CurrentValue,
            },
            CreatedDate: {
                id: FieldId.CreatedDate,
                name: 'CreatedDate',
                dataTypeId: FieldDataTypeId.DateTime,
                displayId: StringId.OrderFieldDisplay_CreatedDate,
                headingId: StringId.OrderFieldHeading_CreatedDate,
            },
            UpdatedDate: {
                id: FieldId.UpdatedDate,
                name: 'UpdatedDate',
                dataTypeId: FieldDataTypeId.DateTime,
                displayId: StringId.OrderFieldDisplay_UpdatedDate,
                headingId: StringId.OrderFieldHeading_UpdatedDate,
            },
            StyleId: {
                id: FieldId.StyleId,
                name: 'Style',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_Style,
                headingId: StringId.OrderFieldHeading_Style,
            },
            Children: {
                id: FieldId.Children,
                name: 'Children',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_Children,
                headingId: StringId.OrderFieldHeading_Children,
            },
            ExecutedQuantity: {
                id: FieldId.ExecutedQuantity,
                name: 'ExecutedQuantity',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.OrderFieldDisplay_ExecutedQuantity,
                headingId: StringId.OrderFieldHeading_ExecutedQuantity,
            },
            AveragePrice: {
                id: FieldId.AveragePrice,
                name: 'AveragePrice',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_AveragePrice,
                headingId: StringId.OrderFieldHeading_AveragePrice,
            },
            Exchange: {
                id: FieldId.Exchange,
                name: 'Exchange',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.OrderFieldDisplay_Exchange,
                headingId: StringId.OrderFieldHeading_Exchange,
            },
            // EnvironmentId: {
            //     id: FieldId.EnvironmentId,
            //     name: 'Environment',
            //     dataTypeId: FieldDataTypeId.Enumeration,
            //     displayId: StringId.OrderFieldDisplay_Environment,
            //     headingId: StringId.OrderFieldHeading_Environment,
            // },
            Code: {
                id: FieldId.Code,
                name: 'Code',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_Code,
                headingId: StringId.OrderFieldHeading_Code,
            },
            SideId: {
                id: FieldId.SideId,
                name: 'DetailsSide',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_Side,
                headingId: StringId.OrderFieldHeading_Side,
            },
            ExtendedSideId: {
                id: FieldId.ExtendedSideId,
                name: 'DetailsExtendedSide',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_ExtendedSide,
                headingId: StringId.OrderFieldHeading_ExtendedSide,
            },
            BrokerageSchedule: {
                id: FieldId.BrokerageSchedule,
                name: 'DetailsBrokerageSchedule',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_BrokerageSchedule,
                headingId: StringId.OrderFieldHeading_BrokerageSchedule,
            },
            EquityOrderTypeId: {
                id: FieldId.EquityOrderTypeId,
                name: 'DetailsType',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_DetailsType,
                headingId: StringId.OrderFieldHeading_DetailsType,
            },
            LimitPrice: {
                id: FieldId.LimitPrice,
                name: 'DetailsLimitPrice',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_LimitPrice,
                headingId: StringId.OrderFieldHeading_LimitPrice,
            },
            Quantity: {
                id: FieldId.Quantity,
                name: 'DetailsQuantity',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.OrderFieldDisplay_Quantity,
                headingId: StringId.OrderFieldHeading_Quantity,
            },
            HiddenQuantity: {
                id: FieldId.HiddenQuantity,
                name: 'DetailsHiddenQuantity',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.OrderFieldDisplay_HiddenQuantity,
                headingId: StringId.OrderFieldHeading_HiddenQuantity,
            },
            MinimumQuantity: {
                id: FieldId.MinimumQuantity,
                name: 'DetailsMinimumQuantity',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.OrderFieldDisplay_MinimumQuantity,
                headingId: StringId.OrderFieldHeading_MinimumQuantity,
            },
            TimeInForceId: {
                id: FieldId.TimeInForceId,
                name: 'DetailsTimeInForce',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_DetailsTimeInForce,
                headingId: StringId.OrderFieldHeading_DetailsTimeInForce,
            },
            ExpiryDate: {
                id: FieldId.ExpiryDate,
                name: 'DetailsExpiryDate',
                dataTypeId: FieldDataTypeId.Date,
                displayId: StringId.OrderFieldDisplay_DetailsExpiryDate,
                headingId: StringId.OrderFieldHeading_DetailsExpiryDate,
            },
            ShortSellTypeId: {
                id: FieldId.ShortSellTypeId,
                name: 'DetailsShortSellType',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_DetailsShortSellType,
                headingId: StringId.OrderFieldHeading_DetailsShortSellType,
            },
            UnitTypeId: {
                id: FieldId.UnitTypeId,
                name: 'DetailsUnitType',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_DetailsUnitType,
                headingId: StringId.OrderFieldHeading_DetailsUnitType,
            },
            UnitAmount: {
                id: FieldId.UnitAmount,
                name: 'DetailsUnitAmount',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_DetailsUnitAmount,
                headingId: StringId.OrderFieldHeading_DetailsUnitAmount,
            },
            ManagedFundCurrency: {
                id: FieldId.ManagedFundCurrency,
                name: 'DetailsCurrency',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_DetailsCurrency,
                headingId: StringId.OrderFieldHeading_DetailsCurrency,
            },
            PhysicalDelivery: {
                id: FieldId.PhysicalDelivery,
                name: 'DetailsPhysicalDelivery',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.OrderFieldDisplay_DetailsPhysicalDelivery,
                headingId: StringId.OrderFieldHeading_DetailsPhysicalDelivery,
            },
            RouteAlgorithmId: {
                id: FieldId.RouteAlgorithmId,
                name: 'RouteAlgorithm',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_RouteAlgorithm,
                headingId: StringId.OrderFieldHeading_RouteAlgorithm,
            },
            RouteMarket: {
                id: FieldId.RouteMarket,
                name: 'RouteMarket',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_RouteMarket,
                headingId: StringId.OrderFieldHeading_RouteMarket,
            },
            TriggerTypeId: {
                id: FieldId.TriggerTypeId,
                name: 'TriggerType',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.OrderFieldDisplay_TriggerType,
                headingId: StringId.OrderFieldHeading_TriggerType,
            },
            TriggerValue: {
                id: FieldId.TriggerValue,
                name: 'TriggerValue',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.OrderFieldDisplay_TriggerValue,
                headingId: StringId.OrderFieldHeading_TriggerValue,
            },
            TriggerExtraParams: {
                id: FieldId.TriggerExtraParams,
                name: 'TriggerExtraParams',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.OrderFieldDisplay_TriggerExtraParams,
                headingId: StringId.OrderFieldHeading_TriggerExtraParams,
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
                throw new EnumInfoOutOfOrderError('OIODIFIS3885', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }
    }

    export function generateMapKey(orderId: Id,
        accountZenithCode: string): MapKey {
        return `${orderId}|${accountZenithCode}`;
    }

    export function isEqual(left: Order, right: Order) {
        return left.id === right.id && left.accountZenithCode === right.accountZenithCode;
    }

    // export class Key {
    //     static readonly JsonTag_OrderId = 'orderId';
    //     static readonly JsonTag_AccountId = 'accountId';

    //     private _mapKey: MapKey;

    //     constructor(public orderId: Id,
    //         public accountId: BrokerageAccountId) {
    //         this._mapKey = Key.generateMapKey(orderId, accountId);
    //     }

    //     get mapKey() {
    //         return this._mapKey;
    //     }

    //     static createNull() {
    //         // will not match any valid holding
    //         return new Key(NullId, BrokerageAccountId.nullId);
    //     }

    //     // saveToJson(element: JsonElement, includeEnvironment = false) {
    //     //     element.setString(Key.JsonTag_OrderId, this.orderId);
    //     //     element.setString(Key.JsonTag_AccountId, this.accountId);
    //     // }
    // }

    // export namespace Key {
    //     export function generateMapKey(orderId: Id,
    //         accountZenithCode: string): MapKey {
    //         return `${orderId}|${accountZenithCode}`;
    //     }

    //     export function isEqual(left: Key, right: Key) {
    //         return left.orderId === right.orderId && left.accountId === right.accountId;
    //     }

    //     // export function tryCreateFromJson(element: JsonElement) {
    //     //     const orderId = element.tryGetString(Key.JsonTag_OrderId);
    //     //     if (orderId === undefined) {
    //     //         return 'Undefined Order';
    //     //     } else {
    //     //         const accountId = element.tryGetString(Key.JsonTag_AccountId);
    //     //         if (accountId === undefined) {
    //     //             return 'Undefined Account';
    //     //         } else {
    //     //             return new Key(orderId, accountId);
    //     //         }
    //     //     }
    //     // }
    // }

    export interface ValueChange {
        fieldId: FieldId;
        recentChangeTypeId: RevRecordValueRecentChangeTypeId | undefined;
    }

    export function createNotFoundOrder(decimalFactory: DecimalFactory, marketsService: MarketsService, account: BrokerageAccount, orderId: string) {
        const route: MarketOrderRoute = { algorithmId: OrderRouteAlgorithmId.Market, marketZenithCode: marketsService.genericUnknownTradingMarket.zenithCode };

        const zeroDecimal = decimalFactory.newDecimal(0);
        const msgData: OrdersDataMessage.AddChange = {
            accountZenithCode: account.zenithCode,
            id: orderId,
            externalId: undefined,
            depthOrderId: undefined,
            status: '',
            tradingMarketZenithCode: '',
            currencyId: Currency.nullCurrencyId,
            estimatedBrokerage: decimalFactory.newDecimal(zeroDecimal),
            currentBrokerage: decimalFactory.newDecimal(zeroDecimal),
            estimatedTax: decimalFactory.newDecimal(zeroDecimal),
            currentTax: decimalFactory.newDecimal(zeroDecimal),
            currentValue: decimalFactory.newDecimal(zeroDecimal),
            createdDate: SourceTzOffsetDateTime.nullDateTime,
            updatedDate: SourceTzOffsetDateTime.nullDateTime,
            children: undefined,
            executedQuantity: 0,
            averagePrice: undefined,
            styleId: IvemClassId.Market,
            exchangeZenithCode: '',
            code: '',
            sideId: OrderSide.nullId,
            brokerageSchedule: undefined,
            instructionIds: [],
            equityOrderTypeId: OrderTypeId.Market,
            limitPrice: undefined,
            quantity: 0,
            hiddenQuantity: undefined,
            minimumQuantity: undefined,
            timeInForceId: TimeInForce.nullId,
            expiryDate: undefined,
            shortSellTypeId: undefined,
            unitTypeId: OrderPriceUnitType.nullId,
            unitAmount: decimalFactory.newDecimal(zeroDecimal),
            managedFundCurrency: undefined,
            physicalDelivery: undefined,
            route,
            trigger: new ImmediateOrderTrigger(),
        };

        const order = new Order(
            marketsService,
            account,
            msgData,
            CorrectnessId.Error,
        );

        return order;
    }

    export function initialiseStatic() {
        Field.initialiseStaticField();
    }
}

export namespace OrderModule {
    export function initialiseStatic() {
        Order.initialiseStatic();
    }
}
