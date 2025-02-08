import { AssertInternalError } from '@xilytix/sysutils';
import { DataDefinition, DataMessage, DataMessageTypeId, FeedClass, FeedClassId, FeedStatusId, QueryTradingMarketsDataDefinition, TradingMarketsDataMessage } from '../common/internal-api';
import { FeedStatusSubscriptionDataItem } from './feed-status-subscription-data-item';

export class TradingMarketsDataItem extends FeedStatusSubscriptionDataItem {
    readonly markets = new Array<TradingMarketsDataMessage.Market>();

    private readonly _feedClassId: FeedClassId;
    private readonly _feedZenithCode: string;

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

    override setFeedStatusId(value: FeedStatusId) {
        if (this.started) {
            super.setFeedStatusId(value);
        } else {
            this._waitingStartedFeedStatusId = value;
        }
    }

    getMarket(zenithCode: string): TradingMarketsDataMessage.Market | undefined {
        const count = this.markets.length;
        for (let i = 0; i < count; i++) {
            const record = this.markets[i];
            if (record.zenithCode === zenithCode) {
                return record;
            }
        }
        return undefined;
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
        const markets = this.markets;
        if (markets.length > 0) {
            // Query can only be called once
            throw new AssertInternalError('ORDIPMOR44490', `${markets.length}`);
        } else {
            const msgMarkets = msg.markets;
            const msgMarketCount = msgMarkets.length;
            markets.length = msgMarketCount;

            for (let i = 0; i < msgMarketCount; i++) {
                const msgMarket = msgMarkets[i];
                markets[i] = msgMarket;
            }
        }
    }
}
