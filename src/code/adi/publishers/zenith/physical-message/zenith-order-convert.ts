import { AssertInternalError, newDecimal, newUndefinableDecimal, UnreachableCaseError } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AurcChangeTypeId,
    BestMarketOrderRoute,
    FixOrderRoute,
    IvemClassId,
    MarketOrderRoute,
    OrderRouteAlgorithmId,
    OrdersDataMessage
} from '../../../common/internal-api';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace ZenithOrderConvert {
    export function toChange(typeId: AurcChangeTypeId, order: ZenithProtocol.TradingController.Orders.Order): OrdersDataMessage.Change {
        switch (typeId) {
            case AurcChangeTypeId.Add: {
                const addChange = new OrdersDataMessage.AddChange();
                loadAddUpdateChange(addChange, order as ZenithProtocol.TradingController.Orders.AddUpdateOrder);
                return addChange;
            }
            case AurcChangeTypeId.Update: {
                const updateChange = new OrdersDataMessage.UpdateChange();
                loadAddUpdateChange(updateChange, order as ZenithProtocol.TradingController.Orders.AddUpdateOrder);
                return updateChange;
            }
            case AurcChangeTypeId.Remove: {
                const removeChange = new OrdersDataMessage.RemoveChange();
                removeChange.accountZenithCode = order.Account;
                loadRemoveChange(removeChange, order as ZenithProtocol.TradingController.Orders.RemoveOrder);
                return removeChange;
            }
            case AurcChangeTypeId.Clear: {
                throw new AssertInternalError('ZOCTCC11193427738');
            }
            default:
                throw new UnreachableCaseError('ZOCTCD343918842701', typeId);
        }
    }

    export function toAddChange(order: ZenithProtocol.TradingController.Orders.AddUpdateOrder) {
        const change = new OrdersDataMessage.AddChange();
        loadAddUpdateChange(change, order);
        return change;
    }

    export function toAddUpdateChange(order: ZenithProtocol.TradingController.Orders.AddUpdateOrder) {
        const change = new OrdersDataMessage.AddUpdateChange();
        loadAddUpdateChange(change, order);
        return change;
    }

    function loadRemoveChange(change: OrdersDataMessage.RemoveChange, value: ZenithProtocol.TradingController.Orders.RemoveOrder) {
        // const environmentedAccountId = ZenithConvert.EnvironmentedAccount.toId(value.Account);
        // change.zenithAccountCode = environmentedAccountId.value.Account;
        change.accountZenithCode = value.Account;
        change.id = value.ID;
    }

    function loadAddUpdateChange(change: OrdersDataMessage.AddUpdateChange, order: ZenithProtocol.TradingController.Orders.AddUpdateOrder) {
        loadChange(change, order);
        switch (order.Style) {
            case ZenithProtocol.TradingController.OrderStyle.Unknown:
                throw new ZenithDataError(ErrorCode.ZOCTOU2243629458, JSON.stringify(order).substring(0, 200));
            case ZenithProtocol.TradingController.OrderStyle.Market:
                loadMarketOrder(change, order as ZenithProtocol.TradingController.Orders.MarketOrder);
                break;
            case ZenithProtocol.TradingController.OrderStyle.ManagedFund:
                loadManagedFundOrder(change, order as ZenithProtocol.TradingController.Orders.ManagedFundOrder);
                break;
            default:
                throw new UnreachableCaseError('ZCTO3399851', order.Style);
        }

        return change;
    }

    function loadMarketOrder(change: OrdersDataMessage.AddUpdateChange, order: ZenithProtocol.TradingController.Orders.MarketOrder) {
        change.styleId = IvemClassId.Market;
        change.executedQuantity = order.ExecutedQuantity;
        if (order.AveragePrice === undefined) {
            change.averagePrice = undefined;
        } else {
            if (order.AveragePrice === null) {
                change.averagePrice = null;
            } else {
                change.averagePrice = newDecimal(order.AveragePrice);
            }
        }
    }

    function loadManagedFundOrder(change: OrdersDataMessage.AddUpdateChange, order: ZenithProtocol.TradingController.Orders.ManagedFundOrder) {
        change.styleId = IvemClassId.ManagedFund;
    }

    function loadChange(change: OrdersDataMessage.AddUpdateChange, order: ZenithProtocol.TradingController.Orders.AddUpdateOrder) {
        // let marketId: MarketId | undefined;
        // let marketBoardId: MarketBoardId | undefined;

        // const environmentedAccountId = ZenithConvert.EnvironmentedAccount.toId(order.Account);
        // const accountId = environmentedAccountId.accountId;
        // const environmentId = environmentedAccountId.environmentId;
        // // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        // if (order.Market === undefined) {
        //     marketId = undefined;
        // } else {
        //     const environmentedMarketId = ZenithConvert.EnvironmentedMarket.toId(order.Market);
        //     marketId = environmentedMarketId.marketId;
        //     // environmentId = environmentedMarketId.environmentId;
        // }
        // // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        // if (order.TradingMarket === undefined) {
        //     marketBoardId = undefined;
        // } else {
        //     const environmentedMarketBoardId = ZenithConvert.EnvironmentedMarketBoard.toId(order.TradingMarket);
        //     marketBoardId = environmentedMarketBoardId.marketBoardId;
        //     // environmentId = environmentedMarketBoardId.environmentId;
        // }

        const createdDate  = ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(order.CreatedDate);
        if (createdDate === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            throw new ZenithDataError(ErrorCode.ZOCLOC1052883977, order.CreatedDate ?? '');
        } else {
            const updatedDate = ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(order.UpdatedDate);
            if (updatedDate === undefined) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                throw new ZenithDataError(ErrorCode.ZOCLOU1052883977, order.CreatedDate ?? '');
            } else {
                change.id = order.ID;
                change.accountZenithCode = order.Account;
                // change.zenithTradingEnvironmentCode = environmentedAccountId.zenithEnvironmentCode;
                change.externalId = order.ExternalID;
                change.depthOrderId = order.DepthOrderID;
                change.status = order.Status;
                // change.marketId = marketId;
                change.tradingMarketZenithCode = order.TradingMarket;
                change.currencyId = ZenithConvert.Currency.tryToId(order.Currency);

                const estimatedFees = order.EstimatedFees;
                if (estimatedFees === undefined) {
                    change.estimatedBrokerage = undefined;
                    change.estimatedTax = undefined;
                } else {
                    const estimatedFeesAsDecimal = ZenithConvert.OrderFees.toDecimal(estimatedFees);
                    change.estimatedBrokerage = estimatedFeesAsDecimal.brokerage;
                    change.estimatedTax = estimatedFeesAsDecimal.tax;
                }
                const currentFees = order.CurrentFees;
                if (currentFees === undefined) {
                    change.currentBrokerage = undefined;
                    change.currentTax = undefined;
                } else {
                    const currentFeesAsDecimal = ZenithConvert.OrderFees.toDecimal(currentFees);
                    change.currentBrokerage = currentFeesAsDecimal.brokerage;
                    change.currentTax = currentFeesAsDecimal.tax;
                }
                change.currentValue = newDecimal(order.CurrentValue);
                change.createdDate = createdDate;
                change.updatedDate = updatedDate;
                change.children = order.Children;
                loadOrderDetails(change, order.Details);
                loadOrderRoute(change, order.Route);
                loadOrderCondition(change, order.Condition);
            }
        }
    }

    function loadOrderDetails(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.PlaceOrder.Details) {
        // const environmentedExchangeId = ZenithConvert.EnvironmentedExchange.toId(value.Exchange);
        // order.zenithExchangeCode = environmentedExchangeId.exchangeId;
        order.exchangeZenithCode = value.Exchange;
        order.code = value.Code;
        order.sideId = ZenithConvert.OrderSide.toId(value.Side);
        order.brokerageSchedule = value.BrokerageSchedule;
        order.instructionIds = ZenithConvert.OrderInstruction.toIdArray(value.Instructions);

        switch (value.Style) {
            case ZenithProtocol.TradingController.OrderStyle.Unknown:
                throw new ZenithDataError(ErrorCode.ZOCLODU87873991318, JSON.stringify(value).substring(0, 200));
            case ZenithProtocol.TradingController.OrderStyle.Market:
                loadMarketOrderDetails(order, value as ZenithProtocol.TradingController.PlaceOrder.MarketDetails);
                break;
            case ZenithProtocol.TradingController.OrderStyle.ManagedFund:
                loadManagedFundOrderDetails(order, value as ZenithProtocol.TradingController.PlaceOrder.ManagedFundDetails);
                break;
            default:
                throw new UnreachableCaseError('ZOCTOD44855', value.Style);
        }
    }

    function loadMarketOrderDetails(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.PlaceOrder.MarketDetails) {
        // order.styleId = OrderStyleId.Market; // done in MarketOrder class
        order.equityOrderTypeId = ZenithConvert.EquityOrderType.toId(value.Type);
        order.limitPrice = newUndefinableDecimal(value.LimitPrice);
        order.quantity = value.Quantity;
        order.hiddenQuantity = value.HiddenQuantity;
        order.minimumQuantity = value.MinimumQuantity;
        order.timeInForceId = ZenithConvert.EquityOrderValidity.toId(value.Validity);
        const expiryDate = value.ExpiryDate;
        order.expiryDate = expiryDate === undefined ? undefined : ZenithConvert.Date.DateTimeIso8601.toSourceTzOffsetDateTime(expiryDate);
        const shortType = value.ShortType;
        order.shortSellTypeId = shortType === undefined ? undefined : ZenithConvert.ShortSellType.toId(shortType);
    }

    function loadManagedFundOrderDetails(order: OrdersDataMessage.AddUpdateChange,
            value: ZenithProtocol.TradingController.PlaceOrder.ManagedFundDetails) {
        // order.styleId = OrderStyleId.ManagedFund; // done in ManagedFundOrder class
        order.unitTypeId = ZenithConvert.OrderPriceUnitType.toId(value.UnitType);
        order.unitAmount = newDecimal(value.UnitAmount);
        order.managedFundCurrency = value.Currency;
        order.physicalDelivery = value.PhysicalDelivery;
    }

    function loadOrderRoute(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.OrderRoute) {
        switch (value.Algorithm) {
            case ZenithProtocol.TradingController.OrderRouteAlgorithm.Market:
                loadMarketOrderRoute(order, value as ZenithProtocol.TradingController.MarketOrderRoute);
                break;
            case ZenithProtocol.TradingController.OrderRouteAlgorithm.BestMarket:
                loadBestMarketOrderRoute(order, value as ZenithProtocol.TradingController.BestMarketOrderRoute);
                break;
            case ZenithProtocol.TradingController.OrderRouteAlgorithm.Fix:
                loadFixOrderRoute(order, value as ZenithProtocol.TradingController.FixOrderRoute);
                break;
            default:
                throw new UnreachableCaseError('ZCTOR33872', value.Algorithm);
        }
    }

    function loadMarketOrderRoute(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.MarketOrderRoute) {
        // const environmentedMarketId = ZenithConvert.EnvironmentedMarket.toId(value.Market);
        // const marketId = environmentedMarketId.marketId;
        const route: MarketOrderRoute = {
            algorithmId: OrderRouteAlgorithmId.Market,
            marketZenithCode: value.Market,
        };
        order.route = route;
    }

    function loadBestMarketOrderRoute(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.BestMarketOrderRoute) {
        const route: BestMarketOrderRoute = {
            algorithmId: OrderRouteAlgorithmId.BestMarket,
        }
        order.route = route;
    }

    function loadFixOrderRoute(order: OrdersDataMessage.AddUpdateChange, value: ZenithProtocol.TradingController.FixOrderRoute) {
        const route: FixOrderRoute = {
            algorithmId: OrderRouteAlgorithmId.Fix,
        };
        order.route = route;
    }

    function loadOrderCondition(order: OrdersDataMessage.AddUpdateChange, value?: ZenithProtocol.TradingController.OrderCondition) {
        order.trigger = ZenithConvert.OrderCondition.toOrderTrigger(value);
    }
}
