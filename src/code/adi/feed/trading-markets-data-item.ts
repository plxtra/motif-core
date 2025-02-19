import { AssertInternalError } from '@xilytix/sysutils';
import { DataDefinition, DataMessage, DataMessageTypeId, FeedClass, FeedClassId, FeedStatusId, QueryTradingMarketsDataDefinition, TradingMarketsDataMessage } from '../common/internal-api';
import { FeedStatusSubscriptionDataItem } from './feed-status-subscription-data-item';

export class TradingMarketsDataItem extends FeedStatusSubscriptionDataItem {
    private readonly _feedClassId: FeedClassId;
    private readonly _feedZenithCode: string;

    private _markets: readonly TradingMarketsDataMessage.Market[] | undefined;

    private _waitingStartedFeedStatusId: FeedStatusId | undefined;

    constructor(definition: DataDefinition) {
        super(definition);

        if (!(definition instanceof QueryTradingMarketsDataDefinition)) {
            throw new AssertInternalError('TMDIC23008', definition.description);
        } else {
            this._feedClassId = FeedClassId.Trading;
            this._feedZenithCode = definition.tradingFeedZenithCode;
        }
    }

    get markets(): readonly TradingMarketsDataMessage.Market[] | undefined { return this._markets; }

    override setFeedStatusId(value: FeedStatusId) {
        if (this.started) {
            super.setFeedStatusId(value);
        } else {
            this._waitingStartedFeedStatusId = value;
        }
    }

    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.TradingMarkets) {
            super.processMessage(msg);
        } else {
            if (!(msg instanceof TradingMarketsDataMessage)) {
                throw new AssertInternalError('ORDIPM38335', JSON.stringify(msg));
            } else {
                this.beginUpdate();
                try {
                    this.advisePublisherResponseUpdateReceived();
                    this.processMessage_TradingMarkets(msg);
                    this.notifyUpdateChange();
                } finally {
                    this.endUpdate();
                }
            }
        }
    }

    protected override start() {
        super.start();

        if (this._waitingStartedFeedStatusId !== undefined) {
            this.setFeedStatusId(this._waitingStartedFeedStatusId);
            this._waitingStartedFeedStatusId = undefined;
        }
    }

    protected override getFeedDisplay(): string {
        return FeedClass.generateFeedDisplay(this._feedClassId, this._feedZenithCode);
    }

    private processMessage_TradingMarkets(msg: TradingMarketsDataMessage) {
        if (this._markets !== undefined) {
            // Query can only be called once
            throw new AssertInternalError('ORDIPMOR44490', `${this._markets.length}`);
        } else {
            this._markets = msg.markets;
        }
    }
}
