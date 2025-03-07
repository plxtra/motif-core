import { AssertInternalError, DecimalFactory, getErrorMessage, Result, UnexpectedCaseError } from '@pbkware/js-utils';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataChannel,
    DataChannelId,
    DataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { AccountsMessageConvert } from './accounts-message-convert';
import { AddToWatchlistMessageConvert } from './add-to-watchlist-message-convert';
import { AmendOrderMessageConvert } from './amend-order-message-convert';
import { BalancesMessageConvert } from './balances-message-convert';
import { CancelOrderMessageConvert } from './cancel-order-message-convert';
import { ChartHistoryMessageConvert } from './chart-history-message-convert';
import { CopyWatchlistMessageConvert } from './copy-watchlist-message-convert';
import { CreateNotificationChannelMessageConvert } from './create-notification-channel-message-convert';
import { CreateScanMessageConvert } from './create-scan-message-convert';
import { CreateWatchlistMessageConvert } from './create-watchlist-message-convert';
import { DeleteNotificationChannelMessageConvert } from './delete-notification-channel-message-convert';
import { DeleteScanMessageConvert } from './delete-scan-message-convert';
import { DeleteWatchlistMessageConvert } from './delete-watchlist-message-convert';
import { DepthLevelsMessageConvert } from './depth-levels-message-convert';
import { DepthMessageConvert } from './depth-message-convert';
import { FeedsMessageConvert } from './feeds-message-convert';
import { FragmentsMessageConvert } from './fragments-message-convert';
import { HoldingsMessageConvert } from './holdings-message-convert';
import { InsertIntoWatchlistMessageConvert } from './insert-into-watchlist-message-convert';
import { MarketsMessageConvert } from './markets-message-convert';
import { MatchesMessageConvert } from './matches-message-convert';
import { MoveInWatchlistMessageConvert } from './move-in-watchlist-message-convert';
import { MoveOrderMessageConvert } from './move-order-message-convert';
import { OrderAuditMessageConvert } from './order-audit-message-convert';
import { OrderRequestsMessageConvert } from './order-requests-message-convert';
import { OrderStatusesMessageConvert } from './order-statuses-message-convert';
import { OrdersMessageConvert } from './orders-message-convert';
import { PlaceOrderMessageConvert } from './place-order-message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { QueryConfigureMessageConvert } from './query-configure-message-convert';
import { QueryNotificationChannelMessageConvert } from './query-notification-channel-message-convert';
import { QueryNotificationChannelsMessageConvert } from './query-notification-channels-message-convert';
import { QueryNotificationDistributionMethodMessageConvert } from './query-notification-distribution-method-message-convert';
import { QueryNotificationDistributionMethodsMessageConvert } from './query-notification-distribution-methods-message-convert';
import { QueryScanMessageConvert } from './query-scan-message-convert';
import { ScansMessageConvert } from './scans-message-convert';
import { SecurityMessageConvert } from './security-message-convert';
import { ServerInfoMessageConvert } from './server-info-message-convert';
import { SymbolsMessageConvert } from './symbols-message-convert';
import { TradesMessageConvert } from './trades-message-convert';
import { TradingMarketsMessageConvert } from './trading-markets-message-convert';
import { TradingStatesMessageConvert } from './trading-states-message-convert';
import { TransactionsMessageConvert } from './transactions-message-convert';
import { UpdateNotificationChannelEnabledMessageConvert } from './update-notification-channel-enabled-message-convert';
import { UpdateNotificationChannelMessageConvert } from './update-notification-channel-message-convert';
import { UpdateScanMessageConvert } from './update-scan-message-convert';
import { UpdateWatchlistMessageConvert } from './update-watchlist-message-convert';
import { WatchlistMessageConvert } from './watchlist-message-convert';
import { WatchlistsMessageConvert } from './watchlists-message-convert';
import { ZenithConvert } from './zenith-convert';

export class ZenithMessageConvert {
    private readonly _queryConfigureMessageConvert: QueryConfigureMessageConvert;
    private readonly _serverInfoMessageConvert: ServerInfoMessageConvert;
    private readonly _feedsMessageConvert: FeedsMessageConvert;
    private readonly _tradingStatesMessageConvert: TradingStatesMessageConvert;
    private readonly _marketsMessageConvert: MarketsMessageConvert;
    private readonly _symbolsMessageConvert: SymbolsMessageConvert;
    private readonly _securityMessageConvert: SecurityMessageConvert;
    private readonly _depthMessageConvert: DepthMessageConvert;
    private readonly _depthLevelsMessageConvert: DepthLevelsMessageConvert;
    private readonly _tradesMessageConvert: TradesMessageConvert;
    private readonly _chartHistoryMessageConvert: ChartHistoryMessageConvert;
    private readonly _fragmentsMessageConvert: FragmentsMessageConvert;
    private readonly _accountsMessageConvert: AccountsMessageConvert;
    private readonly _orderStatusesMessageConvert: OrderStatusesMessageConvert;
    private readonly _tradingMarketsMessageConvert: TradingMarketsMessageConvert;
    private readonly _ordersMessageConvert: OrdersMessageConvert;
    private readonly _holdingsMessageConvert: HoldingsMessageConvert;
    private readonly _balancesMessageConvert: BalancesMessageConvert;
    private readonly _transactionsMessageConvert: TransactionsMessageConvert;
    private readonly _orderRequestsMessageConvert: OrderRequestsMessageConvert;
    private readonly _orderAuditMessageConvert: OrderAuditMessageConvert;
    private readonly _placeOrderMessageConvert: PlaceOrderMessageConvert;
    private readonly _amendOrderMessageConvert: AmendOrderMessageConvert;
    private readonly _cancelOrderMessageConvert: CancelOrderMessageConvert;
    private readonly _moveOrderMessageConvert: MoveOrderMessageConvert;
    private readonly _createScanMessageConvert: CreateScanMessageConvert;
    private readonly _queryScanMessageConvert: QueryScanMessageConvert;
    private readonly _deleteScanMessageConvert: DeleteScanMessageConvert;
    private readonly _updateScanMessageConvert: UpdateScanMessageConvert;
    private readonly _scansMessageConvert: ScansMessageConvert;
    private readonly _matchesMessageConvert: MatchesMessageConvert;
    private readonly _createNotificationChannelMessageConvert: CreateNotificationChannelMessageConvert;
    private readonly _deleteNotificationChannelMessageConvert: DeleteNotificationChannelMessageConvert;
    private readonly _updateNotificationChannelMessageConvert: UpdateNotificationChannelMessageConvert;
    private readonly _updateNotificationChannelEnabledMessageConvert: UpdateNotificationChannelEnabledMessageConvert;
    private readonly _queryNotificationChannelMessageConvert: QueryNotificationChannelMessageConvert;
    private readonly _queryNotificationChannelsMessageConvert: QueryNotificationChannelsMessageConvert;
    private readonly _queryNotificationDistributionMethodMessageConvert: QueryNotificationDistributionMethodMessageConvert;
    private readonly _queryNotificationDistributionMethodsMessageConvert: QueryNotificationDistributionMethodsMessageConvert;
    private readonly _createWatchlistMessageConvert: CreateWatchlistMessageConvert;
    private readonly _updateWatchlistMessageConvert: UpdateWatchlistMessageConvert;
    private readonly _copyWatchlistMessageConvert: CopyWatchlistMessageConvert;
    private readonly _deleteWatchlistMessageConvert: DeleteWatchlistMessageConvert;
    private readonly _watchlistsMessageConvert: WatchlistsMessageConvert;
    private readonly _watchlistMessageConvert: WatchlistMessageConvert;
    private readonly _addToWatchlistMessageConvert: AddToWatchlistMessageConvert;
    private readonly _insertIntoWatchlistMessageConvert: InsertIntoWatchlistMessageConvert;
    private readonly _moveInWatchlistMessageConvert: MoveInWatchlistMessageConvert;

    constructor(
        decimalFactory: DecimalFactory,
    ) {
        this._queryConfigureMessageConvert = new QueryConfigureMessageConvert();
        this._serverInfoMessageConvert = new ServerInfoMessageConvert();
        this._feedsMessageConvert = new FeedsMessageConvert();
        this._tradingStatesMessageConvert = new TradingStatesMessageConvert();
        this._marketsMessageConvert = new MarketsMessageConvert();
        this._symbolsMessageConvert = new SymbolsMessageConvert(decimalFactory);
        this._securityMessageConvert = new SecurityMessageConvert(decimalFactory);
        this._depthMessageConvert = new DepthMessageConvert(decimalFactory);
        this._depthLevelsMessageConvert = new DepthLevelsMessageConvert(decimalFactory);
        this._tradesMessageConvert = new TradesMessageConvert(decimalFactory);
        this._chartHistoryMessageConvert = new ChartHistoryMessageConvert();
        this._fragmentsMessageConvert = new FragmentsMessageConvert();
        this._accountsMessageConvert = new AccountsMessageConvert();
        this._orderStatusesMessageConvert = new OrderStatusesMessageConvert();
        this._tradingMarketsMessageConvert = new TradingMarketsMessageConvert();
        this._ordersMessageConvert = new OrdersMessageConvert(decimalFactory);
        this._holdingsMessageConvert = new HoldingsMessageConvert(decimalFactory);
        this._balancesMessageConvert = new BalancesMessageConvert(decimalFactory);
        this._transactionsMessageConvert = new TransactionsMessageConvert(decimalFactory);
        this._orderRequestsMessageConvert = new OrderRequestsMessageConvert();
        this._orderAuditMessageConvert = new OrderAuditMessageConvert();
        this._placeOrderMessageConvert = new PlaceOrderMessageConvert(decimalFactory);
        this._amendOrderMessageConvert = new AmendOrderMessageConvert(decimalFactory);
        this._cancelOrderMessageConvert = new CancelOrderMessageConvert(decimalFactory);
        this._moveOrderMessageConvert = new MoveOrderMessageConvert(decimalFactory);
        this._createScanMessageConvert = new CreateScanMessageConvert();
        this._queryScanMessageConvert = new QueryScanMessageConvert();
        this._deleteScanMessageConvert = new DeleteScanMessageConvert();
        this._updateScanMessageConvert = new UpdateScanMessageConvert();
        this._scansMessageConvert = new ScansMessageConvert();
        this._matchesMessageConvert = new MatchesMessageConvert();
        this._createNotificationChannelMessageConvert = new CreateNotificationChannelMessageConvert();
        this._deleteNotificationChannelMessageConvert = new DeleteNotificationChannelMessageConvert();
        this._updateNotificationChannelMessageConvert = new UpdateNotificationChannelMessageConvert();
        this._updateNotificationChannelEnabledMessageConvert = new UpdateNotificationChannelEnabledMessageConvert();
        this._queryNotificationChannelMessageConvert = new QueryNotificationChannelMessageConvert();
        this._queryNotificationChannelsMessageConvert = new QueryNotificationChannelsMessageConvert();
        this._queryNotificationDistributionMethodMessageConvert = new QueryNotificationDistributionMethodMessageConvert();
        this._queryNotificationDistributionMethodsMessageConvert = new QueryNotificationDistributionMethodsMessageConvert();
        this._createWatchlistMessageConvert = new CreateWatchlistMessageConvert();
        this._updateWatchlistMessageConvert = new UpdateWatchlistMessageConvert();
        this._copyWatchlistMessageConvert = new CopyWatchlistMessageConvert();
        this._deleteWatchlistMessageConvert = new DeleteWatchlistMessageConvert();
        this._watchlistsMessageConvert = new WatchlistsMessageConvert();
        this._watchlistMessageConvert = new WatchlistMessageConvert();
        this._addToWatchlistMessageConvert = new AddToWatchlistMessageConvert();
        this._insertIntoWatchlistMessageConvert = new InsertIntoWatchlistMessageConvert();
        this._moveInWatchlistMessageConvert = new MoveInWatchlistMessageConvert();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        switch (request.subscription.dataDefinition.channelId) {
            case DataChannelId.ZenithQueryConfigure:    return this._queryConfigureMessageConvert.createRequestMessage(request);
            case DataChannelId.ZenithServerInfo:        return this._serverInfoMessageConvert.createRequestMessage(request);
            case DataChannelId.Feeds:                   return this._feedsMessageConvert.createRequestMessage(request);
            case DataChannelId.TradingStates:           return this._tradingStatesMessageConvert.createRequestMessage(request);
            case DataChannelId.Markets:                 return this._marketsMessageConvert.createRequestMessage(request);
            case DataChannelId.Symbols:                 return this._symbolsMessageConvert.createRequestMessage(request);
            case DataChannelId.Security:                return this._securityMessageConvert.createRequestMessage(request);
            case DataChannelId.Depth:                   return this._depthMessageConvert.createRequestMessage(request);
            case DataChannelId.DepthLevels:             return this._depthLevelsMessageConvert.createRequestMessage(request);
            case DataChannelId.Trades:                  return this._tradesMessageConvert.createRequestMessage(request);
            case DataChannelId.ChartHistory:            return this._chartHistoryMessageConvert.createRequestMessage(request);
            case DataChannelId.LowLevelTopShareholders: return this._fragmentsMessageConvert.createRequestMessage(request);
            case DataChannelId.BrokerageAccounts:       return this._accountsMessageConvert.createRequestMessage(request);
            case DataChannelId.OrderStatuses:           return this._orderStatusesMessageConvert.createRequestMessage(request);
            case DataChannelId.TradingMarkets:             return this._tradingMarketsMessageConvert.createRequestMessage(request);
            case DataChannelId.BrokerageAccountOrders:                  return this._ordersMessageConvert.createRequestMessage(request);
            case DataChannelId.BrokerageAccountHoldings:                return this._holdingsMessageConvert.createRequestMessage(request);
            case DataChannelId.BrokerageAccountBalances:                return this._balancesMessageConvert.createRequestMessage(request);
            case DataChannelId.BrokerageAccountTransactions:            return this._transactionsMessageConvert.createRequestMessage(request);
            case DataChannelId.OrderRequests:           return this._orderRequestsMessageConvert.createRequestMessage(request);
            case DataChannelId.OrderAudit:              return this._orderAuditMessageConvert.createRequestMessage(request);
            case DataChannelId.PlaceOrderRequest:       return this._placeOrderMessageConvert.createRequestMessage(request);
            case DataChannelId.AmendOrderRequest:       return this._amendOrderMessageConvert.createRequestMessage(request);
            case DataChannelId.CancelOrderRequest:      return this._cancelOrderMessageConvert.createRequestMessage(request);
            case DataChannelId.MoveOrderRequest:        return this._moveOrderMessageConvert.createRequestMessage(request);
            case DataChannelId.CreateScan:              return this._createScanMessageConvert.createRequestMessage(request);
            case DataChannelId.QueryScanDetail:         return this._queryScanMessageConvert.createRequestMessage(request);
            case DataChannelId.DeleteScan:              return this._deleteScanMessageConvert.createRequestMessage(request);
            case DataChannelId.UpdateScan:              return this._updateScanMessageConvert.createRequestMessage(request);
            case DataChannelId.ScanDescriptors:         return this._scansMessageConvert.createRequestMessage(request);
            case DataChannelId.DataIvemIdMatches:        return this._matchesMessageConvert.createRequestMessage(request);
            case DataChannelId.CreateNotificationChannel:            return this._createNotificationChannelMessageConvert.createRequestMessage(request);
            case DataChannelId.DeleteNotificationChannel:            return this._deleteNotificationChannelMessageConvert.createRequestMessage(request);
            case DataChannelId.UpdateNotificationChannel:            return this._updateNotificationChannelMessageConvert.createRequestMessage(request);
            case DataChannelId.UpdateNotificationChannelEnabled:     return this._updateNotificationChannelEnabledMessageConvert.createRequestMessage(request);
            case DataChannelId.QueryNotificationChannel:             return this._queryNotificationChannelMessageConvert.createRequestMessage(request);
            case DataChannelId.QueryNotificationChannels:            return this._queryNotificationChannelsMessageConvert.createRequestMessage(request);
            case DataChannelId.QueryNotificationDistributionMethod:  return this._queryNotificationDistributionMethodMessageConvert.createRequestMessage(request);
            case DataChannelId.QueryNotificationDistributionMethods: return this._queryNotificationDistributionMethodsMessageConvert.createRequestMessage(request);
            case DataChannelId.DataIvemIdCreateWatchmakerList:     return this._createWatchlistMessageConvert.createRequestMessage(request);
            case DataChannelId.UpdateWatchmakerList:              return this._updateWatchlistMessageConvert.createRequestMessage(request);
            case DataChannelId.CopyWatchmakerList:                return this._copyWatchlistMessageConvert.createRequestMessage(request);
            case DataChannelId.DeleteWatchmakerList:              return this._deleteWatchlistMessageConvert.createRequestMessage(request);
            case DataChannelId.WatchmakerListDescriptors:         return this._watchlistsMessageConvert.createRequestMessage(request);
            case DataChannelId.DataIvemIdWatchmakerListMembers:    return this._watchlistMessageConvert.createRequestMessage(request);
            case DataChannelId.DataIvemIdAddToWatchmakerList:      return this._addToWatchlistMessageConvert.createRequestMessage(request);
            case DataChannelId.DataIvemIdInsertIntoWatchmakerList: return this._insertIntoWatchlistMessageConvert.createRequestMessage(request);
            case DataChannelId.MoveInWatchmakerList:              return this._moveInWatchlistMessageConvert.createRequestMessage(request);

            default:
                throw new AssertInternalError('ZMCCRD8777487773', DataChannel.idToName(request.subscription.dataDefinition.channelId));
        }
    }

    createDataMessage(subscription: AdiPublisherSubscription, message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id): DataMessage {
        try {
            switch (subscription.dataDefinition.channelId) {
                case DataChannelId.ZenithQueryConfigure: return this._queryConfigureMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.ZenithServerInfo: return this._serverInfoMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.Feeds: return this._feedsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.TradingStates: return this._tradingStatesMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.Markets: return this._marketsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.Symbols: return this._symbolsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.Security: return this._securityMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.Depth: return this._depthMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DepthLevels: return this._depthLevelsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.Trades: return this._tradesMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.ChartHistory: return this._chartHistoryMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.LowLevelTopShareholders: return this._fragmentsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.BrokerageAccounts: return this._accountsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.OrderStatuses: return this._orderStatusesMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.TradingMarkets: return this._tradingMarketsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.BrokerageAccountOrders: return this._ordersMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.BrokerageAccountHoldings: return this._holdingsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.BrokerageAccountBalances: return this._balancesMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.BrokerageAccountTransactions: return this._transactionsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.OrderRequests: return this._orderRequestsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.OrderAudit: return this._orderAuditMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.PlaceOrderRequest: return this._placeOrderMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.AmendOrderRequest: return this._amendOrderMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.CancelOrderRequest: return this._cancelOrderMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.MoveOrderRequest: return this._moveOrderMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.CreateScan: return this._createScanMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.UpdateScan: return this._updateScanMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DeleteScan: return this._deleteScanMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.QueryScanDetail: return this._queryScanMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.ScanDescriptors: return this._scansMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.CreateNotificationChannel: return this._createNotificationChannelMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DeleteNotificationChannel: return this._deleteNotificationChannelMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.UpdateNotificationChannel: return this._updateNotificationChannelMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.UpdateNotificationChannelEnabled: return this._updateNotificationChannelEnabledMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.QueryNotificationChannel: return this._queryNotificationChannelMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.QueryNotificationChannels: return this._queryNotificationChannelsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.QueryNotificationDistributionMethod: return this._queryNotificationDistributionMethodMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.QueryNotificationDistributionMethods: return this._queryNotificationDistributionMethodsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DataIvemIdCreateWatchmakerList: return this._createWatchlistMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.UpdateWatchmakerList: return this._updateWatchlistMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.CopyWatchmakerList: return this._copyWatchlistMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DeleteWatchmakerList: return this._deleteWatchlistMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.WatchmakerListDescriptors: return this._watchlistsMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DataIvemIdWatchmakerListMembers: return this._watchlistMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DataIvemIdAddToWatchmakerList: return this._addToWatchlistMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DataIvemIdInsertIntoWatchmakerList: return this._insertIntoWatchlistMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.MoveInWatchmakerList: return this._moveInWatchlistMessageConvert.parseMessage(subscription, message, actionId);
                case DataChannelId.DataIvemIdMatches: return this._matchesMessageConvert.parseMessage(subscription, message, actionId);
                default:
                    throw new UnexpectedCaseError('MZCCDM113355', subscription.dataDefinition.channelId.toString(10));
            }
        } catch (error) {
            // Failure to parse an incoming data message is a serious error and must be fixed ASAP.
            window.motifLogger.logError(`Zenith message parse error: ${getErrorMessage(error)}`, 300);
            throw error;
        }

    }
}
