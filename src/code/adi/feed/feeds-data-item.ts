import { AssertInternalError, Integer, UsableListChangeTypeId } from '@xilytix/sysutils';
import { StringId, Strings } from '../../res/internal-api';
import { Correctness } from '../../sys/internal-api';
import { DataMessage, DataMessageTypeId, FeedClass, FeedClassId, FeedsDataMessage, FeedStatus, OrderStatusesDataDefinition, QueryTradingMarketsDataDefinition } from '../common/internal-api';
import { RecordsPublisherSubscriptionDataItem } from '../publish-subscribe/internal-api';
import { Feed } from './feed';
import { OrderStatusesDataItem } from './order-statuses-data-item';
import { TradingFeed } from './trading-feed';
import { TradingMarketsDataItem } from './trading-markets-data-item';

export class FeedsDataItem extends RecordsPublisherSubscriptionDataItem<Feed> {
    readonly tradingFeeds = new Array<TradingFeed>();

    private _getReadyTradingFeedMarketsForMarketsServiceResolveFtn: FeedsDataItem.GetReadyTradingFeedMarketsForMarketsServiceResolveFtn | undefined;

    getFeed(classId: FeedClassId, zenithCodeOrFirstInClass: string | undefined) {
        const multiple = FeedClass.idToMultile(classId);
        if (multiple && zenithCodeOrFirstInClass === undefined) {
            throw new AssertInternalError('FDIGD50112', FeedClass.idToDisplay(classId));
        } else {
            for (const feed of this.records) {
                if (feed.classId === classId) {
                    if (zenithCodeOrFirstInClass === undefined || feed.zenithCode === zenithCodeOrFirstInClass) {
                        return feed;
                    }
                }
            }
            return undefined;
        }
    }

    getReadyTradingFeedMarketsForMarketsService(): Promise<FeedsDataItem.TradingFeedMarket[] | undefined> {
        const markets = this.tryGetReadyTradingFeedMarkets();
        if (markets !== undefined) {
            return Promise.resolve(markets);
        } else {
            if (this._getReadyTradingFeedMarketsForMarketsServiceResolveFtn !== undefined) {
                throw new AssertInternalError('FDIGRTFMFMS20112'); // Can only be called by MarketsService and only once
            } else {
                return new Promise<FeedsDataItem.TradingFeedMarket[] | undefined>(
                    (resolve) => this._getReadyTradingFeedMarketsForMarketsServiceResolveFtn = resolve
                );
            }
        }
    }

    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.Feeds) {
            super.processMessage(msg);
        } else {
            if (!(msg instanceof FeedsDataMessage)) {
                throw new AssertInternalError('FDIPM1004888847', JSON.stringify(msg));
            } else {
                this.beginUpdate();
                try {
                    this.advisePublisherResponseUpdateReceived();
                    this.processMessage_Feeds(msg);
                    this.notifyUpdateChange();
                } finally {
                    this.endUpdate();
                }
            }
        }
    }

    protected override processCorrectnessChanged(): void {
        super.processCorrectnessChanged();

        const correctnessId = this.correctnessId;
        window.motifLogger.logInfo(`${Strings[StringId.Feeds]} ${Strings[StringId.Subscription]} ${Strings[StringId.Correctness]}: ${Correctness.idToDisplay(correctnessId)}`)
    }

    private createFeed(msgFeed: FeedsDataMessage.Feed) {
        const classId = msgFeed.classId;
        const zenithCode = msgFeed.zenithCode;
        let result: Feed;
        if (classId === FeedClassId.Trading) {
            const tradingMarketsDefinition = new QueryTradingMarketsDataDefinition();
            tradingMarketsDefinition.tradingFeedZenithCode = zenithCode;
            const tradingMarketsDataItem = this.subscribeDataItem(tradingMarketsDefinition) as TradingMarketsDataItem;

            const orderStatusesDefinition = new OrderStatusesDataDefinition();
            orderStatusesDefinition.tradingFeedZenithCode = zenithCode;
            const orderStatusesDataItem = this.subscribeDataItem(orderStatusesDefinition) as OrderStatusesDataItem;

            const tradingFeed = new TradingFeed(
                classId,
                zenithCode,
                msgFeed.statusId,
                this.correctnessId,
                tradingMarketsDataItem,
                () => { this.unsubscribeDataItem(tradingMarketsDataItem); },
                orderStatusesDataItem,
                () => { this.unsubscribeDataItem(orderStatusesDataItem); },
            );
            this.tradingFeeds.push(tradingFeed);
            const getMarketsPromise = tradingFeed.getMarketsForFieldsDataItem();
            getMarketsPromise.then(
                (feedMarkets) => {
                    if (feedMarkets !== undefined) {
                        window.motifLogger.logInfo(`${Strings[StringId.Feed]} ${Strings[StringId.Trading]} ${Strings[StringId.Markets]} ${Strings[StringId.Available]}: ${FeedClass.idToDisplay(result.classId)}`);

                        if (this._getReadyTradingFeedMarketsForMarketsServiceResolveFtn !== undefined) {
                            const allTradingFeedMarkets = this.tryGetReadyTradingFeedMarkets();
                            if (allTradingFeedMarkets !== undefined) {
                                this._getReadyTradingFeedMarketsForMarketsServiceResolveFtn(allTradingFeedMarkets);
                                this._getReadyTradingFeedMarketsForMarketsServiceResolveFtn = undefined;
                            }
                        }
                    }
                },
                (reason) => { throw AssertInternalError.createIfNotError(reason, 'FDICFGMPR30117'); }
            );
            result = tradingFeed;
        } else {
            result = new Feed(classId, zenithCode, msgFeed.statusId, this.correctnessId);
        }

        window.motifLogger.logInfo(`${Strings[StringId.Create]} ${FeedClass.idToDisplay(result.classId)} ${Strings[StringId.Feed]}: ${result.zenithCode} (${FeedStatus.idToDisplay(result.statusId)})`);

        return result;
    }

    private indexOfFeed(classId: FeedClassId, zenithName: string) {
        const count = this.count;
        for (let i = 0; i < count; i++) {
            const feed = this.records[i];
            if (feed.classId === classId && feed.zenithCode === zenithName) {
                return i;
            }
        }
        return -1;
    }

    private checkApplyAddRange(msgFeeds: FeedsDataMessage.Feeds, addStartMsgIdx: Integer, endPlus1MsgIdx: Integer) {
        if (addStartMsgIdx >= 0) {
            const addCount = endPlus1MsgIdx - addStartMsgIdx;
            const addStartIdx = this.extendRecordCount(addCount);
            let addIdx = addStartIdx;
            for (let i = addStartMsgIdx; i < endPlus1MsgIdx; i++) {
                const msgFeed = msgFeeds[i];
                const feed = this.createFeed(msgFeed);
                this.setRecord(addIdx++, feed);
            }
            this.checkUsableNotifyListChange(UsableListChangeTypeId.Insert, addStartIdx, addCount);
        }
    }

    private processMessage_Feeds(msg: FeedsDataMessage) {
        let addStartMsgIdx = -1;

        for (let i = 0; i < msg.feeds.length; i++) {
            const msgFeed = msg.feeds[i];
            const idx = this.indexOfFeed(msgFeed.classId, msgFeed.zenithCode);
            if (idx >= 0) {
                this.checkApplyAddRange(msg.feeds, addStartMsgIdx, i);
                const feed = this.records[idx];
                feed.change(msgFeed.statusId);
            } else {
                if (addStartMsgIdx < 0) {
                    addStartMsgIdx = i;
                }
            }
        }

        this.checkApplyAddRange(msg.feeds, addStartMsgIdx, msg.feeds.length);
    }

    private tryGetReadyTradingFeedMarkets(): FeedsDataItem.TradingFeedMarket[] | undefined {
        if (!this.usable) {
            return undefined;
        } else {
            const feeds = this.tradingFeeds;
            const feedCount = feeds.length;

            if (feedCount === 0) {
                return [];
            } else {
                if (feedCount === 1) {
                    const feed = feeds[0];
                    if (feed.marketsReady) {
                        return this.createTradingFeedMarketsFromFeed(feed);
                    } else {
                        return undefined;
                    }
                } else {
                    for (let i = 0; i < feedCount; i++) {
                        const feed = feeds[i];
                        if (!feed.marketsReady) {
                            return undefined;
                        }
                    }

                    let readyMarkets = this.createTradingFeedMarketsFromFeed(feeds[0]);
                    for (let i = 1; i < feedCount; i++) {
                        const feed = feeds[i];
                        const feedMarkets = this.createTradingFeedMarketsFromFeed(feed);
                        readyMarkets = [...readyMarkets, ...feedMarkets];
                    }
                    return readyMarkets;
                }
            }
        }
    }

    private createTradingFeedMarketsFromFeed(feed: TradingFeed): FeedsDataItem.TradingFeedMarket[] {
        const markets = feed.markets;
        const count = markets.length;
        const result = new Array<FeedsDataItem.TradingFeedMarket>(count);
        for (let i = 0; i < count; i++) {
            const market = markets[i];
            result[i] = {
                feed,
                ...market,
            };
        }
        return result;
    }
}

export namespace FeedsDataItem {
    export type GetReadyTradingFeedMarketsForMarketsServiceResolveFtn = (this: void, markets: TradingFeedMarket[] | undefined) => void;

    export interface TradingFeedMarket extends TradingFeed.Market {
        feed: TradingFeed;
    }
}
