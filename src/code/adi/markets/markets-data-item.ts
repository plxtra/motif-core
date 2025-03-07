import { AssertInternalError, Integer } from '@pbkware/js-utils';
import { StringId, Strings } from '../../res/internal-api';
import { BadnessComparableList } from '../../sys/badness-comparable-list';
import { Correctness } from '../../sys/correctness';
import { DataDefinition, DataMessage, DataMessageTypeId, MarketsDataMessage } from '../common/internal-api';
import { PublisherSubscriptionDataItem } from '../publish-subscribe/internal-api';
import { ZenithDataMarket } from './zenith-market';

export class MarketsDataItem extends /*RecordsPublisherSubscriptionDataItem<Market>*/ PublisherSubscriptionDataItem {
    readonly markets: BadnessComparableList<ZenithDataMarket>;

    constructor(definition: DataDefinition) {
        super(definition);
        this.markets = new BadnessComparableList<ZenithDataMarket>();
        this.markets.setBadness(this.badness);
    }

    getMarket(zenithCode: string): ZenithDataMarket | undefined {
        const count = this.markets.count;
        for (let i = 0; i < count; i++) {
            const market = this.markets.getAt(i);
            if (market.zenithCode === zenithCode) {
                return market;
            }
        }
        return undefined;
    }

    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.Markets) {
            super.processMessage(msg);
        } else {
            if (!(msg instanceof MarketsDataMessage)) {
                throw new AssertInternalError('MDIPM10048888478', JSON.stringify(msg));
            } else {
                this.beginUpdate();
                try {
                    this.advisePublisherResponseUpdateReceived();
                    this.processMessage_Markets(msg);
                    this.notifyUpdateChange();
                } finally {
                    this.endUpdate();
                }
            }
        }
    }

    protected override processBadnessChanged(): void {
        this.markets.setBadness(this.badness);
    }

    protected override processCorrectnessChanged(): void {
        super.processCorrectnessChanged();

        const correctnessId = this.correctnessId;
        window.motifLogger.logInfo(`${Strings[StringId.Markets]} ${Strings[StringId.Subscription]} ${Strings[StringId.Correctness]}: ${Correctness.idToDisplay(correctnessId)}`)
    }

    private processMessage_Markets(msg: MarketsDataMessage) {
        const msgMarkets = msg.markets;
        const msgMarketCount = msgMarkets.length;
        let addStartMsgIdx = -1;

        for (let i = 0; i < msgMarketCount; i++) {
            const msgMarket = msgMarkets[i];
            const market = this.getMarket(msgMarket.zenithCode);
            if (market !== undefined) {
                this.checkApplyAddBlock(msgMarkets, addStartMsgIdx, i);
                addStartMsgIdx = -1;
                market.update(msgMarket);
            } else {
                if (addStartMsgIdx < 0) {
                    addStartMsgIdx = i;
                }
            }
        }

        this.checkApplyAddBlock(msg.markets, addStartMsgIdx, msgMarketCount);
    }

    private checkApplyAddBlock(msgStates: readonly MarketsDataMessage.Market[], addStartMsgIdx: Integer, endPlus1MsgIdx: Integer) {
        if (addStartMsgIdx >= 0) {
            const addCount = endPlus1MsgIdx - addStartMsgIdx;
            const addMarkets = new Array<ZenithDataMarket>(addCount);
            for (let i = addStartMsgIdx; i < endPlus1MsgIdx; i++) {
                const msgMarket = msgStates[i];
                addMarkets[i] = new ZenithDataMarket(msgMarket);
            }
            this.markets.addRange(addMarkets);
        }
    }
}

export namespace MarketsDataItem {
    // All records are allowed
    // export function getAllowedMarkets(markets: Market[]): MarketId[] {
    //     const allowedMarkets: MarketId[] = [];

    //     for (let index = 0; index < markets.length; index++) {
    //         const market = markets[index];
    //         allowedMarkets.push(market.marketId);
    //     }

    //     // Add the mixed market variations.
    //     if (allowedMarkets.includes(MarketId.AsxTradeMatch) && allowedMarkets.includes(MarketId.ChixAustLimit)) {
    //         allowedMarkets.push(MarketId.AsxCxa);
    //     }

    //     return allowedMarkets;
    // }
}
