import { SourceTzOffsetDate, SourceTzOffsetDateTime } from '@pbkware/js-utils';
import { FeedStatusId, MarketsDataMessage, ZenithMarketBoards } from '../common/internal-api';

export class ZenithDataMarket implements MarketsDataMessage.Market {
    readonly zenithCode: string;

    changedEventerForDataMarket: ZenithDataMarket.ChangedEventer | undefined; // Only DataMarket can use this

    private _feedStatusId: FeedStatusId;
    private _zenithMarketBoards: ZenithMarketBoards | undefined;
    private _tradingDate: SourceTzOffsetDate | undefined;
    private _marketTime: SourceTzOffsetDateTime | undefined;
    private _status: string | undefined;

    constructor (msgMarket: MarketsDataMessage.Market) {
        this.zenithCode = msgMarket.zenithCode;
        this._feedStatusId = msgMarket.feedStatusId;
        this._zenithMarketBoards = msgMarket.zenithMarketBoards;
        this._tradingDate = msgMarket.tradingDate;
        this._marketTime = msgMarket.marketTime;
        this._status = msgMarket.status;
    }

    get feedStatusId(): FeedStatusId { return this._feedStatusId; }
    get zenithMarketBoards(): ZenithMarketBoards | undefined { return this._zenithMarketBoards; }
    get tradingDate(): SourceTzOffsetDate | undefined { return this._tradingDate; }
    get marketTime(): SourceTzOffsetDateTime | undefined { return this._marketTime; }
    get status(): string | undefined { return this._status; }

    update(msg: MarketsDataMessage.Market): void {
        let changed = false;

        const msgFeedStatusId = msg.feedStatusId;
        if (msgFeedStatusId !== this._feedStatusId) {
            this._feedStatusId = msgFeedStatusId;
            changed = true;
        }

        const msgBoards = msg.zenithMarketBoards;
        if (!ZenithMarketBoards.isUndefinableEqual(msgBoards, this._zenithMarketBoards)) {
            this._zenithMarketBoards = msgBoards;
            changed = true;
        }

        const msgTradingDate = msg.tradingDate;
        if (!SourceTzOffsetDate.isUndefinableEqual(msgTradingDate, this._tradingDate)) {
            this._tradingDate = msgTradingDate;
            changed = true;
        }

        const msgMarketTime = msg.marketTime;
        if (!SourceTzOffsetDateTime.isUndefinableEqual(msgMarketTime, this._marketTime)) {
            this._marketTime = msgMarketTime;
            changed = true;
        }

        const msgStatus = msg.status;
        if (msgStatus !== this._status) {
            this._status = msgStatus;
            changed = true;
        }

        if (changed) {
            this.notifyChanged();
        }
    }

    private notifyChanged() {
        if (this.changedEventerForDataMarket !== undefined) {
            this.changedEventerForDataMarket();
        }
    }
}

export namespace ZenithDataMarket {
    export type ChangedEventer = (this: void) => void;
}
