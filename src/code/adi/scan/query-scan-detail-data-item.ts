import { DataDefinition, DataMessage, DataMessageTypeId, QueryScanDetailDataMessage } from '../common/internal-api';
import { DataMarket, MarketsService } from '../markets/internal-api';
import { DataIvemId, MarketIvemId } from '../symbol-id/internal-api';
import { ScanDescriptorAndDetail } from './scan-descriptor-and-detail';
import { ScanPublishDataItem } from './scan-publish-data-item';

export class QueryScanDetailDataItem extends ScanPublishDataItem {
    private _descriptorAndDetail: ScanDescriptorAndDetail;

    constructor(private readonly _marketsService: MarketsService, definition: DataDefinition) {
        super(definition);
    }

    get descriptorAndDetail() { return this._descriptorAndDetail; }

    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.QueryScanDetail) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                this.advisePublisherResponseUpdateReceived();
                this.notifyUpdateChange();
                this.processMessage_QueryScanDetailResponse(msg as QueryScanDetailDataMessage);
            } finally {
                this.endUpdate();
            }
        }
    }

    private processMessage_QueryScanDetailResponse(msg: QueryScanDetailDataMessage) {
        let targetMarkets: DataMarket[] | undefined;
        const targetMarketZenithCodes = msg.targetMarketZenithCodes;
        if (targetMarketZenithCodes === undefined) {
            targetMarkets = undefined;
        } else {
            targetMarkets = this._marketsService.getDataMarkets(targetMarketZenithCodes, true);
        }

        let targetDataIvemIds: DataIvemId[] | undefined;
        const targetSymbols = msg.targetSymbols;
        if (targetSymbols === undefined) {
            targetDataIvemIds = undefined;
        } else {
            targetDataIvemIds = MarketIvemId.createArrayFromZenithSymbols(this._marketsService.dataMarkets, targetSymbols, DataIvemId);
        }

        this._descriptorAndDetail = {
            id: msg.scanId,
            name: msg.scanName,
            description: msg.scanDescription,
            readonly: msg.scanReadonly,
            statusId: msg.scanStatusId,
            enabled: msg.enabled,
            versionNumber: msg.versionNumber,
            versionId: msg.versionId,
            versioningInterrupted: msg.versioningInterrupted,
            lastSavedTime: msg.lastSavedTime,
            lastEditSessionId: msg.lastEditSessionId,
            symbolListEnabled: msg.symbolListEnabled,
            zenithCriteriaSource: msg.zenithCriteriaSource,
            zenithRankSource: msg.zenithRankSource,
            zenithCriteria: msg.zenithCriteria,
            zenithRank: msg.zenithRank,
            targetTypeId: msg.targetTypeId,
            targetMarkets,
            targetDataIvemIds,
            maxMatchCount: msg.maxMatchCount,
            attachedNotificationChannels: msg.attachedNotificationChannels,
        };
    }
}
