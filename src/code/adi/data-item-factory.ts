import {
    AssertInternalError,
    NotImplementedError,
    UnreachableCaseError
} from '../sys/internal-api';
import { AllBalancesDataItem } from './all-balances-data-item';
import { AllHoldingsDataItem } from './all-holdings-data-item';
import { AllOrdersDataItem } from './all-orders-data-item';
import { AmendOrderDataItem } from './amend-order-data-item';
import { BrokerageAccountBalancesDataItem } from './brokerage-account-balances-data-item';
import { BrokerageAccountHoldingsDataItem } from './brokerage-account-holdings-data-item';
import { BrokerageAccountOrdersDataItem } from './brokerage-account-orders-data-item';
import { BrokerageAccountsDataItem } from './brokerage-accounts-data-item';
import { CancelOrderDataItem } from './cancel-order-data-item';
import { ChartHistoryDataItem } from './chart-history-data-item';
import {
    DataChannelId,
    DataDefinition
} from "./common/internal-api";
import { DataItem, DataMgr } from './data-item/internal-api';
import { DayTradesDataItem } from './day-trades-data-item';
import { DepthDataItem } from './depth-data-item';
import { DepthLevelsDataItem } from './depth-levels-data-item';
import { ClassFeedsDataItem, FeedsDataItem, OrderStatusesDataItem, TradingMarketsDataItem } from './feed/internal-api';
import { LatestTradingDayTradesDataItem } from './latest-trading-day-trades-data-item';
import { LowLevelTopShareholdersDataItem } from './low-level-top-shareholders-data-item';
import { MarketsService } from './markets/internal-api';
import { MarketsDataItem } from './markets/markets-data-item';
import { TradingStatesDataItem } from './markets/trading-states-data-item';
import { MoveOrderDataItem } from './move-order-data-item';
import { CreateNotificationChannelDataItem, DeleteNotificationChannelDataItem, QueryNotificationChannelDataItem, QueryNotificationChannelsDataItem, QueryNotificationDistributionMethodDataItem, QueryNotificationDistributionMethodsDataItem, UpdateNotificationChannelDataItem, UpdateNotificationChannelEnabledDataItem } from './notification-channel/internal-api';
import { PlaceOrderDataItem } from './place-order-data-item';
import { CreateScanDataItem } from './scan/create-scan-data-item';
import { DataIvemIdScanMatchesDataItem } from './scan/data-ivem-id-scan-matches-data-item';
import { DeleteScanDataItem } from './scan/delete-scan-data-item';
import { QueryScanDetailDataItem } from './scan/query-scan-detail-data-item';
import { ScanStatusedDescriptorsDataItem } from './scan/scan-statused-descriptors-data-item';
import { UpdateScanDataItem } from './scan/update-scan-data-item';
import { SecurityDataItem } from './security-data-item';
import { SymbolsDataItem } from './symbols-data-item';
import { TopShareholdersDataItem } from './top-shareholders-data-item';
import { TradesDataItem } from './trades-data-item';
import { TransactionsDataItem } from './transactions-data-item';
import {
    CopyWatchmakerListDataItem,
    DataIvemIdAddToWatchmakerListDataItem,
    DataIvemIdCreateWatchmakerListDataItem,
    DataIvemIdInsertIntoWatchmakerListDataItem,
    DataIvemIdWatchmakerListMembersDataItem,
    DeleteWatchmakerListDataItem,
    MoveInWatchmakerListDataItem,
    UpdateWatchmakerListDataItem,
    WatchmakerListDescriptorsDataItem,
} from './watchmaker/internal-api';
import { ZenithExtConnectionDataItem } from './zenith-ext-connection-data-item';
import { ZenithServerInfoDataItem } from './zenith-server-info-data-item';

export class DataItemFactory implements DataMgr.DataItemFactory {
    private _marketsService: MarketsService;

    setMarketsService(value: MarketsService): void {
        this._marketsService = value;
    }

    createDataItem(dataDefinition: DataDefinition): DataItem {

        switch (dataDefinition.channelId) {
            case DataChannelId.ZenithExtConnection:
                return new ZenithExtConnectionDataItem(dataDefinition);
            case DataChannelId.ZenithQueryConfigure:
                throw new AssertInternalError('DMCDI12129984534'); // move out of here when DataItems are registered

            case DataChannelId.Feeds:
                return new FeedsDataItem(dataDefinition);
            case DataChannelId.ClassFeeds:
                return new ClassFeedsDataItem(dataDefinition);
            case DataChannelId.TradingStates:
                return new TradingStatesDataItem(dataDefinition);
            case DataChannelId.Markets:
                return new MarketsDataItem(dataDefinition);
            case DataChannelId.Symbols:
                return new SymbolsDataItem(this._marketsService, dataDefinition);
            case DataChannelId.Security:
                return new SecurityDataItem(this._marketsService, dataDefinition);
            case DataChannelId.Trades:
                return new TradesDataItem(this._marketsService, dataDefinition);
            case DataChannelId.LatestTradingDayTrades:
                return new LatestTradingDayTradesDataItem(dataDefinition);
            case DataChannelId.DayTrades:
                return new DayTradesDataItem(dataDefinition);
            case DataChannelId.Depth:
                return new DepthDataItem(this._marketsService, dataDefinition);
            case DataChannelId.DepthLevels:
                return new DepthLevelsDataItem(this._marketsService, dataDefinition);
            case DataChannelId.LowLevelTopShareholders:
                return new LowLevelTopShareholdersDataItem(dataDefinition);
            case DataChannelId.TopShareholders:
                return new TopShareholdersDataItem(dataDefinition);
            case DataChannelId.BrokerageAccounts:
                return new BrokerageAccountsDataItem(this._marketsService, dataDefinition);
            case DataChannelId.BrokerageAccountHoldings:
                return new BrokerageAccountHoldingsDataItem(this._marketsService, dataDefinition);
            case DataChannelId.AllHoldings:
                return new AllHoldingsDataItem(dataDefinition);
            case DataChannelId.BrokerageAccountBalances:
                return new BrokerageAccountBalancesDataItem(this._marketsService, dataDefinition);
            case DataChannelId.AllBalances:
                return new AllBalancesDataItem(dataDefinition);
            case DataChannelId.BrokerageAccountOrders:
                return new BrokerageAccountOrdersDataItem(this._marketsService, dataDefinition);
            case DataChannelId.AllOrders:
                return new AllOrdersDataItem(dataDefinition);
            case DataChannelId.BrokerageAccountTransactions:
                return new TransactionsDataItem(dataDefinition);
            case DataChannelId.AllTransactions:
                throw new NotImplementedError('DMCDIAT3111043842');

            case DataChannelId.OrderRequests:
                throw new NotImplementedError('DMCDIOR2111043842');

            case DataChannelId.OrderAudit:
                throw new NotImplementedError('DMCDIOA393837522');

            case DataChannelId.PlaceOrderRequest:
                return new PlaceOrderDataItem(dataDefinition);
            case DataChannelId.AmendOrderRequest:
                return new AmendOrderDataItem(dataDefinition);
            case DataChannelId.CancelOrderRequest:
                return new CancelOrderDataItem(dataDefinition);
            case DataChannelId.MoveOrderRequest:
                return new MoveOrderDataItem(dataDefinition);
            case DataChannelId.CreateScan:
                return new CreateScanDataItem(dataDefinition);
            case DataChannelId.QueryScanDetail:
                return new QueryScanDetailDataItem(this._marketsService, dataDefinition);
            case DataChannelId.DeleteScan:
                return new DeleteScanDataItem(dataDefinition);
            case DataChannelId.UpdateScan:
                return new UpdateScanDataItem(dataDefinition);
            case DataChannelId.ScanDescriptors:
                return new ScanStatusedDescriptorsDataItem(dataDefinition);
            case DataChannelId.DataIvemIdMatches:
                return new DataIvemIdScanMatchesDataItem(this._marketsService, dataDefinition);
            case DataChannelId.CreateNotificationChannel:
                return new CreateNotificationChannelDataItem(dataDefinition);
            case DataChannelId.DeleteNotificationChannel:
                return new DeleteNotificationChannelDataItem(dataDefinition);
            case DataChannelId.UpdateNotificationChannel:
                return new UpdateNotificationChannelDataItem(dataDefinition);
            case DataChannelId.UpdateNotificationChannelEnabled:
                return new UpdateNotificationChannelEnabledDataItem(dataDefinition);
            case DataChannelId.QueryNotificationChannel:
                return new QueryNotificationChannelDataItem(dataDefinition);
            case DataChannelId.QueryNotificationChannels:
                return new QueryNotificationChannelsDataItem(dataDefinition);
            case DataChannelId.QueryNotificationDistributionMethod:
                return new QueryNotificationDistributionMethodDataItem(dataDefinition);
            case DataChannelId.QueryNotificationDistributionMethods:
                return new QueryNotificationDistributionMethodsDataItem(dataDefinition);
            case DataChannelId.DataIvemIdCreateWatchmakerList:
                return new DataIvemIdCreateWatchmakerListDataItem(dataDefinition);
            case DataChannelId.UpdateWatchmakerList:
                return new UpdateWatchmakerListDataItem(dataDefinition);
            case DataChannelId.CopyWatchmakerList:
                return new CopyWatchmakerListDataItem(dataDefinition);
            case DataChannelId.DeleteWatchmakerList:
                return new DeleteWatchmakerListDataItem(dataDefinition);
            case DataChannelId.WatchmakerListDescriptors:
                return new WatchmakerListDescriptorsDataItem(dataDefinition);
            case DataChannelId.DataIvemIdWatchmakerListMembers:
                return new DataIvemIdWatchmakerListMembersDataItem(dataDefinition);
            case DataChannelId.DataIvemIdAddToWatchmakerList:
                return new DataIvemIdAddToWatchmakerListDataItem(dataDefinition);
            case DataChannelId.DataIvemIdInsertIntoWatchmakerList:
                return new DataIvemIdInsertIntoWatchmakerListDataItem(dataDefinition);
            case DataChannelId.MoveInWatchmakerList:
                return new MoveInWatchmakerListDataItem(dataDefinition);
            case DataChannelId.OrderStatuses:
                return new OrderStatusesDataItem(dataDefinition);
            case DataChannelId.TradingMarkets:
                return new TradingMarketsDataItem(dataDefinition);
            case DataChannelId.ZenithServerInfo:
                return new ZenithServerInfoDataItem(dataDefinition);
            case DataChannelId.ChartHistory:
                return new ChartHistoryDataItem(dataDefinition);
            default:
                throw new UnreachableCaseError('DMCDI65993', dataDefinition.channelId);
        }
    }
}
