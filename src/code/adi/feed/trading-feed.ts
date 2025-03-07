import {
    AssertInternalError,
    EnumInfoOutOfOrderError,
    Integer,
    MultiEvent
} from '@pbkware/js-utils';
import { StringId, Strings } from '../../res/internal-api';
import {
    Badness,
    Correctness,
    CorrectnessId,
    FieldDataTypeId,
} from "../../sys/internal-api";
import { FeedClassId, FeedStatusId, OrderStatuses, TradingMarketsDataMessage } from '../common/internal-api';
import { Feed } from './feed';
import { OrderStatusesDataItem } from './order-statuses-data-item';
import { TradingMarketsDataItem } from './trading-markets-data-item';

export class TradingFeed extends Feed {
    tradingMarketsDataItemNoLongerRequiredEventer: TradingFeed.TradingMarketsDataItemNoLongerRequiredEventer | undefined;
    orderStatusesDataItemNoLongerRequiredEventer: TradingFeed.OrderStatusesDataItemNoLongerRequiredEventer | undefined;

    private _markets: TradingFeed.Markets | undefined;
    private _tradingMarketsDataItem: TradingMarketsDataItem | undefined;
    private _tradingMarketsDataItemCorrectnessChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _getMarketsForFieldsDataItemResolveFtn: TradingFeed.GetMarketsForFieldsDataItemResolveFtn | undefined;

    private _orderStatuses: OrderStatuses = [];
    private _orderStatusesDataItem: OrderStatusesDataItem | undefined;
    private _orderStatusesDataItemCorrectnessChangedSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        classId: FeedClassId,
        zenithCode: string,
        statusId: FeedStatusId,
        listCorrectnessId: CorrectnessId,
        tradingMarketsDataItem: TradingMarketsDataItem | undefined,
        tradingMarketsDataItemNoLongerRequiredEventer: TradingFeed.TradingMarketsDataItemNoLongerRequiredEventer | undefined,
        orderStatusesDataItem: OrderStatusesDataItem | undefined,
        orderStatusesDataItemNoLongerRequiredEventer: TradingFeed.OrderStatusesDataItemNoLongerRequiredEventer | undefined,
    ) {
        super(classId, zenithCode, statusId, listCorrectnessId);

        // classId, zenithName and orderStatusesDataItemNoLongerRequiredEventer will be undefined for null trade feed
        if (tradingMarketsDataItem !== undefined && tradingMarketsDataItemNoLongerRequiredEventer !== undefined) {
            this._tradingMarketsDataItem = tradingMarketsDataItem;
            this.tradingMarketsDataItemNoLongerRequiredEventer = tradingMarketsDataItemNoLongerRequiredEventer;

            tradingMarketsDataItem.setFeedStatusId(statusId);

            if (tradingMarketsDataItem.usable) {
                const markets = tradingMarketsDataItem.markets;
                if (markets === undefined) {
                    throw new AssertInternalError('TFCTMU20092');
                } else {
                    this._markets = this.createTradingFeedMarkets(markets);
                    this.processTradingMarketsDataItemCorrectnessChangedEvent()
                }
            } else {
                this._tradingMarketsDataItemCorrectnessChangedSubscriptionId = this._tradingMarketsDataItem.subscribeCorrectnessChangedEvent(
                    () => this.processTradingMarketsDataItemCorrectnessChangedEvent()
                );
            }
        }

        // classId, zenithName and orderStatusesDataItemNoLongerRequiredEventer will be undefined for null trade feed
        if (orderStatusesDataItem !== undefined && orderStatusesDataItemNoLongerRequiredEventer !== undefined) {
            this._orderStatusesDataItem = orderStatusesDataItem;
            this.orderStatusesDataItemNoLongerRequiredEventer = orderStatusesDataItemNoLongerRequiredEventer;

            orderStatusesDataItem.setFeedStatusId(statusId);

            if (Correctness.idIsUsable(orderStatusesDataItem.correctnessId)) {
                this._orderStatuses = orderStatusesDataItem.orderStatuses;
                this.processOrderStatusesDataItemCorrectnessChangedEvent()
            } else {
                this._orderStatusesDataItemCorrectnessChangedSubscriptionId = this._orderStatusesDataItem.subscribeCorrectnessChangedEvent(
                    () => this.processOrderStatusesDataItemCorrectnessChangedEvent()
                );
            }
        }
    }

    get marketsBadness() { return this._tradingMarketsDataItem === undefined ? Badness.notBad : this._tradingMarketsDataItem.badness; }
    get markets() { return this._markets; }

    get orderStatusesBadness() { return this._orderStatusesDataItem === undefined ? Badness.notBad : this._orderStatusesDataItem.badness; }
    get orderStatuses() { return this._orderStatuses; }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    get orderStatusCount(): Integer | undefined { return this._orderStatuses === undefined ? undefined : this._orderStatuses.length; }

    override destroy() {
        this.processMarketsReadyOrAbort(undefined);
        this.processOrderStatusesReadyOrAbort();
        super.destroy();
    }

    override change(feedStatusId: FeedStatusId) {
        super.change(feedStatusId);

        if (this._tradingMarketsDataItem !== undefined) {
            this._tradingMarketsDataItem.setFeedStatusId(feedStatusId);
        }
        if (this._orderStatusesDataItem !== undefined) {
            this._orderStatusesDataItem.setFeedStatusId(feedStatusId);
        }
    }

    getMarketsForFieldsDataItem(): Promise<TradingFeed.Markets | undefined> {
        if (this._tradingMarketsDataItem === undefined) {
            return Promise.resolve(this._markets);
        } else {
            if (this._getMarketsForFieldsDataItemResolveFtn !== undefined) {
                throw new AssertInternalError('TFGMFFDI67199') // Can only be called by MarketsSvc and only once
            } else {
                return new Promise<TradingFeed.Markets | undefined>(
                    (resolve) => { this._getMarketsForFieldsDataItemResolveFtn = resolve; }
                );
            }
        }
    }

    protected override calculateCorrectnessId() {
        const dataItemCorrectnessId = super.calculateCorrectnessId();
        const tradingMarketsDataItem = this._tradingMarketsDataItem;
        const tradingMarketsCorrectnessId = tradingMarketsDataItem === undefined ? undefined : tradingMarketsDataItem.correctnessId;
        const orderStatusesDataItem = this._orderStatusesDataItem;
        const orderStatusesCorrectnessId = orderStatusesDataItem === undefined ? undefined : orderStatusesDataItem.correctnessId;
        const mergedTradingMarketsAndOrderStatusCorrctnessId = Correctness.merge2UndefinableIds(tradingMarketsCorrectnessId, orderStatusesCorrectnessId);
        if (mergedTradingMarketsAndOrderStatusCorrctnessId === undefined) {
            return dataItemCorrectnessId;
        } else {
            return Correctness.merge2Ids(this.correctnessId, mergedTradingMarketsAndOrderStatusCorrctnessId);
        }
    }

    private processOrderStatusesDataItemCorrectnessChangedEvent() {
        const dataItem = this._orderStatusesDataItem;
        if (dataItem === undefined) {
            throw new AssertInternalError('TFPOSFC23688399993');
        } else {
            if (Correctness.idIsUsable(dataItem.correctnessId)) {
                this._orderStatuses = dataItem.orderStatuses;
                this.processOrderStatusesReadyOrAbort();
            }
            this.updateCorrectness();
        }
    }

    private processTradingMarketsDataItemCorrectnessChangedEvent() {
        const dataItem = this._tradingMarketsDataItem;
        if (dataItem === undefined) {
            throw new AssertInternalError('TFPOSFC23688399993');
        } else {
            if (Correctness.idIsUsable(dataItem.correctnessId)) {
                const dataItemMarkets = dataItem.markets;
                if (dataItemMarkets === undefined) {
                    throw new AssertInternalError('TFPTMDICCE20091');
                } else {
                    this._markets = this.createTradingFeedMarkets(dataItemMarkets);
                    this.processMarketsReadyOrAbort(this._markets);
                }
            }
            this.updateCorrectness();
        }
    }

    private processMarketsReadyOrAbort(markets: TradingFeed.Markets | undefined) {
        if (this._tradingMarketsDataItem !== undefined) {
            this._tradingMarketsDataItem.unsubscribeCorrectnessChangedEvent(this._tradingMarketsDataItemCorrectnessChangedSubscriptionId);
            this._tradingMarketsDataItemCorrectnessChangedSubscriptionId = undefined;
            if (this.tradingMarketsDataItemNoLongerRequiredEventer !== undefined) {
                this.tradingMarketsDataItemNoLongerRequiredEventer();
                this.tradingMarketsDataItemNoLongerRequiredEventer = undefined;
            }
            this._tradingMarketsDataItem = undefined;
        }

        if (this._getMarketsForFieldsDataItemResolveFtn !== undefined) {
            this._getMarketsForFieldsDataItemResolveFtn(markets);
            this._getMarketsForFieldsDataItemResolveFtn = undefined;
        }
    }

    private processOrderStatusesReadyOrAbort() {
        if (this._orderStatusesDataItem !== undefined) {
            this._orderStatusesDataItem.unsubscribeCorrectnessChangedEvent(this._orderStatusesDataItemCorrectnessChangedSubscriptionId);
            this._orderStatusesDataItemCorrectnessChangedSubscriptionId = undefined;
            if (this.orderStatusesDataItemNoLongerRequiredEventer !== undefined) {
                this.orderStatusesDataItemNoLongerRequiredEventer();
                this.orderStatusesDataItemNoLongerRequiredEventer = undefined;
            }
            this._orderStatusesDataItem = undefined;
        }
    }

    private createTradingFeedMarkets(dataMessageMarkets: readonly TradingMarketsDataMessage.Market[]): TradingFeed.Market[] {
        const count = dataMessageMarkets.length;
        const result = new Array<TradingFeed.Market>(count);
        for (let i = 0; i < count; i++) {
            const dataMessageMarket = dataMessageMarkets[i];
            result[i] = {
                ...dataMessageMarket,
                feed: this,
            };
        }
        return result;
    }
}

export namespace TradingFeed {
    export type BecameUsableEventHandler = (this: void) => void;
    export type TradingMarketsDataItemNoLongerRequiredEventer = (this: void) => void;
    export type OrderStatusesDataItemNoLongerRequiredEventer = (this: void) => void;
    export type GetMarketsForFieldsDataItemResolveFtn = (this: void, markets: TradingFeed.Markets | undefined) => void;

    export interface Market extends TradingMarketsDataMessage.Market {
        feed: TradingFeed;
    }
    export type Markets = readonly Market[];

    export const enum TradingFieldId {
        ClassId,
        ZenithCode,
        Environment,
        Name,
        StatusId,
        MarketCount,
        OrderStatusCount,
    }

    export namespace TradingField {
        interface Info {
            readonly id: TradingFieldId;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof TradingFieldId]: Info };
        const infosObject: InfosObject = {
            ClassId: {
                id: TradingFieldId.ClassId,
                name: 'ClassId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.FeedFieldDisplay_ClassId,
                headingId: StringId.FeedFieldHeading_ClassId,
            },
            ZenithCode: {
                id: TradingFieldId.ZenithCode,
                name: 'ZenithName',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.FeedFieldDisplay_ZenithCode,
                headingId: StringId.FeedFieldHeading_ZenithCode,
            },
            Environment: {
                id: TradingFieldId.Environment,
                name: 'Environment',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.FeedFieldDisplay_Environment,
                headingId: StringId.FeedFieldHeading_Environment,
            },
            Name: {
                id: TradingFieldId.Name,
                name: 'Name',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.FeedFieldDisplay_Name,
                headingId: StringId.FeedFieldHeading_Name,
            },
            StatusId: {
                id: TradingFieldId.StatusId,
                name: 'StatusId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.FeedFieldDisplay_StatusId,
                headingId: StringId.FeedFieldHeading_StatusId,
            },
            MarketCount: {
                id: TradingFieldId.MarketCount,
                name: 'MarketCount',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.TradingFeedFieldDisplay_MarketCount,
                headingId: StringId.TradingFeedFieldHeading_MarketCount,
            },
            OrderStatusCount: {
                id: TradingFieldId.OrderStatusCount,
                name: 'OrderStatusCount',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.TradingFeedFieldDisplay_OrderStatusCount,
                headingId: StringId.TradingFeedFieldHeading_OrderStatusCount,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export function initialiseField() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as TradingFieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('TradingFeed.FieldId', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }

        export function idToName(id: TradingFieldId) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: TradingFieldId) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: TradingFieldId) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: TradingFieldId) {
            return Strings[idToDisplayId(id)];
        }

        export function idToHeadingId(id: TradingFieldId) {
            return infos[id].headingId;
        }

        export function idToHeading(id: TradingFieldId) {
            return Strings[idToHeadingId(id)];
        }
    }

    export const nullFeed = new TradingFeed(
        FeedClassId.Authority,  // not really null but need to pick something
        '',
        FeedStatusId.Impaired,
        CorrectnessId.Error,
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

