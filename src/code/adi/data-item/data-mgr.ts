import {
    AssertInternalError,
    ComparableList,
    ComparisonResult,
    concatenateArrayUniquely,
    Integer,
    Logger,
    MapKey,
    mSecsPerSec,
    secsPerMin,
    SysTick
} from '@pbkware/js-utils';
import {
    assert,
    assigned,
} from '../../sys';
import {
    AdiPublisher,
    AdiPublisherTypeId,
    broadcastDataItemRequestNr,
    DataChannel,
    DataChannelId,
    DataDefinition,
    DataItemId,
    DataMessage,
    DataMessages
} from "../common/internal-api";
import { DataItem } from './data-item';
import { DataItemsActivationMgr } from './data-items-activation-mgr';
import { ExtConnectionDataItem } from './ext-connection-data-item';

export class DataMgr {
    private readonly _referencableDataItems = new DataMgr.ReferencableDataItemList();
    private readonly _allDataItems = new DataMgr.AllDataItems();
    private readonly _activationMgrs: DataItemsActivationMgr[];
    private _nextProcessTickTime: SysTick.Time;
    private _processInterval = 5 * secsPerMin * mSecsPerSec; // 5 minutes.

    private _permanentFeedsDataItem: DataItem | undefined;
    private _permanentMarketsDataItem: DataItem | undefined;
    private _permanentBrokerageAccountsDataItem: DataItem | undefined;
    private _permanentAllOrdersDataItem: DataItem | undefined;
    // private _permanentBrokersDataItem: DataItem | undefined;
    private _permanentDependsOnChannels: DataChannelId[];

    private _dataSubscriptionsCachingEnabled = true;

    private _publishers: AdiPublisher[] = [];

    private _beginMultipleSubscriptionChangesCount = 0;

    private readonly _orphanedDataItemList = new DataMgr.OrphanedDataItemList();

    constructor(
        private readonly _dataItemFactory: DataMgr.DataItemFactory,
        private readonly _adiPublisherFactory: AdiPublisher.Factory,
    ) {
        this._processInterval =
            this._nextProcessTickTime = SysTick.now() + this._processInterval;

        this._activationMgrs = [];
        this._activationMgrs.length = DataChannel.idCount;

        for (let index = 0; index < this._activationMgrs.length; index++) {
            this._activationMgrs[index] = new DataItemsActivationMgr();
            this._activationMgrs[index].beginMultipleActivationChangesEvent = () => { this.handleBeginMultipleActivationChanges(); };
            this._activationMgrs[index].endMultipleActivationChangesEvent = () => { this.handleEndMultipleActivationChanges(); };
            this._activationMgrs[index].activeSubscriptionsLimit = DataChannel.idToDefaultActiveLimit(index);
            this._activationMgrs[index].deactivationDelay = DataChannel.idToDefaultDeactivationDelay(index);
            this._activationMgrs[index].cacheDataSubscriptions = this._dataSubscriptionsCachingEnabled;
        }

        this._permanentDependsOnChannels = [];
    }

    get dataItemCount(): Integer {
        return this._allDataItems.count;
    }

    get dataSubscriptionCachingEnabled() { return this._dataSubscriptionsCachingEnabled; }
    set dataSubscriptionCachingEnabled(value: boolean) {
        this._dataSubscriptionsCachingEnabled = value;
        this.setActivationMgrsCacheDataSubscriptions(this._dataSubscriptionsCachingEnabled);
    }

    isPermanentSubscription(definition: DataDefinition): boolean {
        switch (definition.channelId) {
            case DataChannelId.Feeds:
            case DataChannelId.Markets:
            case DataChannelId.BrokerageAccounts:
            case DataChannelId.AllOrders:
                return true;
            // case DataChannelId.Brokers: return true;
            default:
                return false;
        }
    }

    deactivateAvailable(dataItem: DataItem): void {
        this._activationMgrs[dataItem.channelId].deactivateAvailable(dataItem);
    }

    process(nowTickTime: SysTick.Time): void {
        this.processPublishers();

        if (nowTickTime >= this._nextProcessTickTime) {
            for (let index = 0; index < this._activationMgrs.length; index++) {
                this._activationMgrs[index].checkForDeactivations(nowTickTime);
            }
            this._nextProcessTickTime += this._processInterval;
        }
    }

    forceFind(definition: DataDefinition) {
        let dataItem = this._referencableDataItems.get(definition);

        //   if not Found then
        if (dataItem === undefined) {
            dataItem = this.createDataItem(definition);
        }

        return dataItem;
    }

    deletePublishers(): void {
        window.motifLogger.log(Logger.LevelId.Info, 'Deleting Publishers');

        if (this.dataItemCount > 0) {
            window.motifLogger.log(Logger.LevelId.Warning, 'DataItemsStore is not empty (DF).  DataItemCount = ' + this.dataItemCount.toString(10));
        }

        this._publishers.length = 0;
    }

    subscribe(dataDefinition: DataDefinition) {
        let dataItem: DataItem | undefined;

        if (dataDefinition.referencable) {
            dataItem = this.checkForPermanentSubscription(dataDefinition);
        }

        if (dataItem === undefined) {
            if (dataDefinition.referencable) {
                dataItem = this.forceFind(dataDefinition);
                this.checkMakePermanentSubscription(dataItem);
            } else {
                dataItem = this.createDataItem(dataDefinition);
            }

            dataItem.incSubscribeCount();
        }

        return dataItem;
    }

    unsubscribe(dataItem: DataItem): void {
        if (!this.isPermanentSubscription(dataItem.definition)) {
            dataItem.decSubscribeCount();
        }
    }

    beginMultipleSubscriptionChanges(): void {
        if (this._beginMultipleSubscriptionChangesCount === 0) {
            for (let index = 0; index < this._publishers.length; index++) {
                this._publishers[index].batchSubscriptionChanges = true;
            }
        }
        this._beginMultipleSubscriptionChangesCount++;
    }

    endMultipleSubscriptionChanges(): void {
        this._beginMultipleSubscriptionChangesCount--;
        if (this._beginMultipleSubscriptionChangesCount === 0) {
            for (let index = 0; index < this._publishers.length; index++) {
                this._publishers[index].batchSubscriptionChanges = false;
            }
        }
        if (this._beginMultipleSubscriptionChangesCount < 0) {
            throw new AssertInternalError('DMEMSC2399388853');
        }
    }

    private handleWantActivationEvent(dataItem: DataItem) {
        this._activationMgrs[dataItem.channelId].wantActivation(dataItem);
    }

    private handleCancelWantActivationEvent(dataItem: DataItem) {
        this._activationMgrs[dataItem.channelId].cancelWantActivation(dataItem);
    }

    private handleKeepActivationEvent(dataItem: DataItem) {
        this._activationMgrs[dataItem.channelId].keepActivation(dataItem);
    }

    private handleAvailableForDeactivationEvent(dataItem: DataItem) {
        this._activationMgrs[dataItem.channelId].availableForDeactivation(dataItem);
    }

    private handleRequirePublisherEvent(definition: DataDefinition): AdiPublisher {
        const publisherTypeId = AdiPublisherTypeId.Zenith; // so far we only support Zenith
        const publisher = this.getPublisherFromType(publisherTypeId);
        return publisher;
    }

    private handleRequireDestructionEvent(dataItem: DataItem) {
        if (dataItem.definition.referencable) {
            this._referencableDataItems.remove(dataItem);
        }

        this._allDataItems.remove(dataItem);
    }

    private handleDataItemRequireDataItemEvent(definition: DataDefinition): DataItem {
        return this.subscribe(definition);
    }

    private handleDataItemReleaseDataItemEvent(dataItem: DataItem) {
        this.unsubscribe(dataItem);
    }

    private handleBeginMultipleActivationChanges() {
        this.beginMultipleSubscriptionChanges();
    }

    private handleEndMultipleActivationChanges() {
        this.endMultipleSubscriptionChanges();
    }

    private createDataItem(dataDefinition: DataDefinition): DataItem {

        const dataItem = this._dataItemFactory.createDataItem(dataDefinition);


        dataItem.onWantActivation = (aDataItem) => { this.handleWantActivationEvent(aDataItem); };
        dataItem.onCancelWantActivation = (aDataItem) => { this.handleCancelWantActivationEvent(aDataItem); };
        dataItem.onKeepActivation = (aDataItem) => { this.handleKeepActivationEvent(aDataItem); };
        dataItem.onAvailableForDeactivation = (aDataItem) => { this.handleAvailableForDeactivationEvent(aDataItem); };
        dataItem.onRequirePublisher = (definition) => this.handleRequirePublisherEvent(definition);
        dataItem.onRequireDestruction = (aDataItem) => { this.handleRequireDestructionEvent(aDataItem); };
        dataItem.onRequireDataItem = (Definition) => this.handleDataItemRequireDataItemEvent(Definition);
        dataItem.onReleaseDataItem = (aDataItem) => { this.handleDataItemReleaseDataItemEvent(aDataItem); };

        if (dataDefinition.referencable) {
            this._referencableDataItems.add(dataItem);
        }

        this._allDataItems.add(dataItem);

        return dataItem;
    }

    private checkForPermanentSubscription(definition: DataDefinition): DataItem | undefined {
        if (!this.isPermanentSubscription(definition)) {
            return undefined;
        } else {
            switch (definition.channelId) {
                case DataChannelId.Feeds:
                    return this._permanentFeedsDataItem;

                case DataChannelId.Markets:
                    return this._permanentMarketsDataItem;

                case DataChannelId.BrokerageAccounts:
                    return this._permanentBrokerageAccountsDataItem;

                case DataChannelId.AllOrders:
                    return this._permanentAllOrdersDataItem;

                // case DataChannelId.Brokers:
                //     return this._permanentBrokersDataItem;

                default:
                    throw new AssertInternalError('DMCFPS55555993', definition.description);
            }
        }
    }

    private checkMakePermanentSubscription(dataItem: DataItem) {
        const definition = dataItem.definition;

        if (this.isPermanentSubscription(definition)) {
            const channelId = definition.channelId;

            switch (channelId) {
                case DataChannelId.Feeds:
                    this._permanentFeedsDataItem = dataItem;
                    break;

                case DataChannelId.Markets:
                    this._permanentMarketsDataItem = dataItem;
                    break;

                case DataChannelId.BrokerageAccounts:
                    this._permanentBrokerageAccountsDataItem = dataItem;
                    break;

                case DataChannelId.AllOrders:
                    this._permanentAllOrdersDataItem = dataItem;
                    break;

                // case DataChannelId.Brokers:
                //     this._permanentBrokersDataItem = dataItem;
                //     break;


                default:
                    throw new AssertInternalError('DMCMPS56834343', definition.description);
            }

            this._permanentDependsOnChannels = concatenateArrayUniquely(this._permanentDependsOnChannels,
                DataChannel.idToFullDependsOnSet(channelId));
        }
    }

    private unsubscribePermanentSubscriptions() {
        // if (this._permanentBrokersDataItem) {
        //     this._permanentBrokersDataItem.decSubscribeCount();
        //     this._permanentBrokersDataItem = undefined;
        // }

        if (this._permanentFeedsDataItem !== undefined) {
            this._permanentFeedsDataItem.decSubscribeCount();
            this._permanentFeedsDataItem = undefined;
        }

        if (this._permanentMarketsDataItem !== undefined) {
            this._permanentMarketsDataItem.decSubscribeCount();
            this._permanentMarketsDataItem = undefined;
        }

        if (this._permanentBrokerageAccountsDataItem !== undefined) {
            this._permanentBrokerageAccountsDataItem.decSubscribeCount();
            this._permanentBrokerageAccountsDataItem = undefined;
        }

        if (this._permanentAllOrdersDataItem !== undefined) {
            this._permanentAllOrdersDataItem.decSubscribeCount();
            this._permanentAllOrdersDataItem = undefined;
        }

    }

    private removeOrphanedDataItems() {
        const remainingDataItemCount = this.dataItemCount;
        let orphanCount = 0;

        if (remainingDataItemCount > 0) {
            orphanCount = 0;
            this._orphanedDataItemList.capacity = remainingDataItemCount;
            const dataItems = this._allDataItems.asArray();
            for (const dataItem of dataItems) {
                const cond1 = !(dataItem instanceof ExtConnectionDataItem);
                const cond2 = !this.isPermanentSubscription(dataItem.definition);
                const cond3 = !this._permanentDependsOnChannels.includes(dataItem.channelId);

                if (cond1 && cond2 && cond3) {
                    window.motifLogger.log(Logger.LevelId.Warning, 'Orphaned DataItem: ' + dataItem.definition.description);
                    this._orphanedDataItemList.add(dataItem);
                    orphanCount++;
                }
            }
        }
        this._orphanedDataItemList.deactivateDataItems();

        if (orphanCount > 0) {
            window.motifLogger.log(Logger.LevelId.Warning, 'Number of Orphaned DataItems: ' + orphanCount.toString(10));
        }
    }

    private setActivationMgrsCacheDataSubscriptions(value: boolean) {
        for (let index = 0; index < this._activationMgrs.length; index++) {
            this._activationMgrs[index].cacheDataSubscriptions = value;
        }
    }

    // private createPublisher(typeId: AdiPublisherTypeId): AdiPublisher {
    //     switch (typeId) {
    //         case AdiPublisherTypeId.Zenith:
    //             return new ZenithPublisher();

    //         default:
    //             throw new UnreachableCaseError('DMCFS299987', typeId);
    //     }
    // }

    private getPublisherFromType(typeId: AdiPublisherTypeId) {
        for (let index = 0; index < this._publishers.length; index++) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (this._publishers[index].publisherTypeId === typeId) {
                return this._publishers[index];
            }
        }

        const publisher = this._adiPublisherFactory.createPublisher(typeId);
        this._publishers.push(publisher);
        if (this._beginMultipleSubscriptionChangesCount > 0) {
            publisher.batchSubscriptionChanges = true;
        }
        return publisher;
    }

    private processPublishers() {
        for (let index = 0; index < this._publishers.length; index++) {
            const msgs = this._publishers[index].getMessages(SysTick.now());
            if (msgs !== undefined) {
                this.processMessages(msgs);
            }
        }
    }

    private processMessages(msgs: DataMessages) {
        for (let index = 0; index < msgs.count; index++) {
            const msg = msgs.getAt(index);
            this.processMessage(msg);
        }
    }

    private processMessage(msg: DataMessage) {
        assert(assigned(msg.dataItemId), 'DataItemId must be assigned.');

        const dataItem = this._allDataItems.get(msg.dataItemId);
        if (dataItem !== undefined) {
            const dataItemRequestNr = msg.dataItemRequestNr;
            if (dataItemRequestNr === dataItem.activeRequestNr || dataItemRequestNr === broadcastDataItemRequestNr) {
                dataItem.processMessage(msg);
            }

            if (dataItem.deactivationDelayed && !dataItem.online) {
                this.deactivateAvailable(dataItem);
            }
        }
    }
}

export namespace DataMgr {
    export type DelayDeactivationEvent = (this: void, dataItem: DataItem, delay: number) => number; // Return "delay".

    export interface DataItemFactory {
        createDataItem(dataDefinition: DataDefinition): DataItem;
    }

    export class ReferencableDataItemList {
        private _map = new Map<MapKey, DataItem>();

        get(definition: DataDefinition) {
            return this._map.get(definition.referencableKey);
        }

        remove(dataItem: DataItem) {
            const definition = dataItem.definition;
            if (!(definition instanceof DataDefinition)) {
                throw new AssertInternalError('DMRDILR6993966');
            } else {
                this._map.delete(definition.referencableKey);
            }
        }

        add(dataItem: DataItem) {
            const definition = dataItem.definition;
            const mapKey = definition.referencableKey;
            if (this._map.has(mapKey)) {
                throw new AssertInternalError('DMRDILADI699453322', definition.description);
            } else {
                this._map.set(mapKey, dataItem);
            }
        }
    }

    export class AllDataItems {
        private _map = new Map<DataItemId, DataItem>();

        get count() {
            return this._map.size;
        }

        get(id: DataItemId) {
            return this._map.get(id);
        }

        remove(dataItem: DataItem) {
            return this._map.delete(dataItem.id);
        }

        add(dataItem: DataItem) {
            if (this._map.has(dataItem.id)) {
                throw new AssertInternalError('DMADILADI40028669', dataItem.definition.description);
            } else {
                this._map.set(dataItem.id, dataItem);
            }
        }

        // values(): MapIterator<DataItem> {
        //     return this._map.values();
        // }

        asArray(): DataItem[] {
            const count = this._map.size;
            const result = new Array<DataItem>(count);
            if (count > 0) {
                let idx = 0;
                const iterator = this._map.values();
                let iteratorResult = iterator.next();
                while (!iteratorResult.done) {
                    result[idx++] = iteratorResult.value;
                    iteratorResult = iterator.next();
                }
            }

            return result;
        }
    }

    export class OrphanedDataItemList extends ComparableList<DataItem | undefined> {
        deactivateDataItems() {
            this.sort(OrphanedDataItemList.compareItems);

            for (let index = this.count - 1; index >= 0; index--) {
                const dataItem = this.getAt(index);
                // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                if (dataItem !== undefined && dataItem.active) {
                    dataItem.deactivate();
                    this.setAt(index, undefined);
                }
            }

            this.clear();
        }
    }

    export namespace OrphanedDataItemList {
        export function compareItems(left: DataItem | undefined, right: DataItem | undefined) {
            if (left === undefined) {
                if (right === undefined) {
                    return ComparisonResult.LeftEqualsRight;
                } else {
                    return ComparisonResult.LeftGreaterThanRight;
                }
            } else {
                if (right === undefined) {
                    return ComparisonResult.LeftLessThanRight;
                } else {
                    return DataChannel.compareDependencyIndex(left.channelId, right.channelId);
                }
            }
        }
    }
}
