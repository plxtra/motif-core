import {
    AssertInternalError,
    MultiEvent,
    SourceTzOffsetDate
} from '@xilytix/sysutils';
import {
    Badness,
    CorrectnessId,
} from '../sys/internal-api';
import { DataDefinition, FeedClass, FeedClassId } from './common/internal-api';
import { FeedStatusSubscriptionDataItem } from './feed/internal-api';
import { DataMarket, MarketsService } from './markets/internal-api';

export abstract class MarketSubscriptionDataItem extends FeedStatusSubscriptionDataItem {
    readonly marketZenithCode: string;

    private _market: DataMarket;
    private _marketFeedStatusChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        protected readonly _marketsService: MarketsService,
        myDataDefinition: DataDefinition,
        market: DataMarket,
    ) {
        super(myDataDefinition);
        this._market = market;
        this.marketZenithCode = market.zenithCode;
    }

    get market() {
        if (this._market.destroyed) {
            const foundMarket = this._marketsService.dataMarkets.findZenithCode(this.marketZenithCode);
            if (foundMarket === undefined) {
                throw new AssertInternalError('MSDIGM49813', this.marketZenithCode);
            } else {
                this.unsubscribeMarket();
                this._market = foundMarket;
                this.subscribeMarket();
                return foundMarket;
            }
        } else {
            return this._market;
        }
    }
    get exchange() { return this._market.exchange; }
    get marketTradingDate(): SourceTzOffsetDate | undefined { return this.market.tradingDate; }

    protected override start() {
        this.subscribeMarket();
        super.start();
        this.setFeedStatusId(this.market.feedStatusId);
    }

    protected override stop() {
        super.stop();

        this.unsubscribeMarket();
    }

    protected override getFeedDisplay(): string {
        return FeedClass.generateFeedDisplay(FeedClassId.Market, this.marketZenithCode);
    }

    protected override calculateUsabilityBadness() {
        // Normally would priortise badness from base class.  However subscription cannot come online without Market or Feed Data
        // So if Market or Feed Data not available, prioritise this badness
        const market = this.market; // use getter
        if (market.usable) {
            return super.calculateUsabilityBadness();
        } else {
            return this.calculateMarketUnusableBadness(market);
        }
    }

    private subscribeMarket() {
        this._marketFeedStatusChangeSubscriptionId = this._market.subscribeFeedStatusChangeEvent(
            () => { this.setFeedStatusId(this.market.feedStatusId); }
        );
    }

    private unsubscribeMarket() {
        this._market.unsubscribeFeedStatusChangeEvent(this._marketFeedStatusChangeSubscriptionId);
        this._marketFeedStatusChangeSubscriptionId = undefined;
    }

    private calculateMarketUnusableBadness(market: DataMarket) {
        if (market.correctnessId === CorrectnessId.Error) {
            return {
                reasonId: Badness.ReasonId.MarketError,
                reasonExtra: market.zenithCode,
            };
        } else {
            return {
                reasonId: Badness.ReasonId.MarketWaiting,
                reasonExtra: market.zenithCode,
            };
        }
    }
}
