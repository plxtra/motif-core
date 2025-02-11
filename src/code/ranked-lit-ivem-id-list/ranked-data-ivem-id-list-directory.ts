import {
    Integer,
    LockOpenListItem,
    MultiEvent,
    UnreachableCaseError,
    UsableListChangeTypeId
} from '@xilytix/sysutils';
import { RankedDataIvemIdListDirectoryItem } from '../services/internal-api';
import {
    Badness,
    BadnessComparableList,
    BadnessMappedComparableList,
    ResourceBadness,
} from '../sys/internal-api';

export class RankedDataIvemIdListDirectory extends BadnessComparableList<RankedDataIvemIdListDirectoryItem> {
    private readonly _sourceCount: Integer;
    private readonly _sources: RankedDataIvemIdListDirectory.Source[];
    // private readonly _listChangeQueue = new RankedDataIvemIdListDirectory.ListChangeQueue();

    constructor(
        namedSourceLists: readonly RankedDataIvemIdListDirectory.NamedSourceList[],
        private readonly _locker: LockOpenListItem.Locker,
    ) {
        super();
        this._sourceCount = namedSourceLists.length;
        this._sources = new Array<RankedDataIvemIdListDirectory.Source>(this._sourceCount);
        for (let i = 0; i < this._sourceCount; i++) {
            const namedSourceList = namedSourceLists[i];
            const sourceList = namedSourceList.list;

            const badnessResourceName = namedSourceList.name;
            const source: RankedDataIvemIdListDirectory.Source = {
                list: namedSourceList.list,
                badnessResourceName,
                lastResourceBadness: {
                    reasonId: Badness.ReasonId.Inactive,
                    reasonExtra: '',
                    resourceName: badnessResourceName,
                },
                badnessChangedEventSubscriptionId: sourceList.subscribeBadnessChangedEvent(
                    () => { this.handleSourceBadnessChangedEvent(source); }
                ),
                listChangeEventSubscriptionId: sourceList.subscribeListChangeEvent(
                    (listChangeTypeId, idx, count) => {
                        this.handleSourceListChangeEvent(source, listChangeTypeId, idx, count);
                    }
                ),
            }
            this._sources[i] = source;

            const sourceListCount = sourceList.count;
            if (sourceListCount > 0) {
                this.addSubRange(sourceList.items, 0, sourceListCount);
            }
        }

        this.updateBadness(undefined);
    }

    finalise() {
        for (const source of this._sources) {
            const sourceList = source.list;
            sourceList.unsubscribeBadnessChangedEvent(source.badnessChangedEventSubscriptionId);
            source.badnessChangedEventSubscriptionId = undefined;
            sourceList.unsubscribeListChangeEvent(source.listChangeEventSubscriptionId);
            source.listChangeEventSubscriptionId = undefined;
        }
    }

    // open() {
    //     for (const source of this._sources) {
    //         const sourceList = source.list;
    //         source.badnessChangedEventSubscriptionId = sourceList.subscribeBadnessChangedEvent(
    //             () => { this.handleSourceBadnessChangedEvent(source); }
    //         );
    //         source.listChangeEventSubscriptionId = sourceList.subscribeListChangeEvent(
    //             (listChangeTypeId, idx, count) => {
    //                 this.handleSourceListChangeEvent(source, listChangeTypeId, idx, count);
    //             }
    //         );
    //     }

    //     this.setUnusable({ reasonId: Badness.ReasonId.Opening, reasonExtra: '' });

    //     this.enqueueListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.Open, undefined, []);
    // }

    // close() {
    //     for (const source of this._sources) {
    //         const sourceList = source.list;
    //         sourceList.unsubscribeBadnessChangedEvent(source.badnessChangedEventSubscriptionId);
    //         source.badnessChangedEventSubscriptionId = undefined;
    //         sourceList.unsubscribeListChangeEvent(source.listChangeEventSubscriptionId);
    //         source.listChangeEventSubscriptionId = undefined;
    //     }

    //     this.enqueueListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.Close, undefined, []);

    //     this.setUnusable(Badness.inactive);
    // }

    private handleSourceBadnessChangedEvent(source: RankedDataIvemIdListDirectory.Source) {
        this.updateBadness(source);
    }

    private handleSourceListChangeEvent(source: RankedDataIvemIdListDirectory.Source, listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                break; // handled through badness change
            case UsableListChangeTypeId.PreUsableAdd:
                this.addSubRange(source.list.items, idx, count);
                break;
            case UsableListChangeTypeId.PreUsableClear:
                this.clearSource(source.list);
                break;
            case UsableListChangeTypeId.Usable:
                // handled through badness change
                break;
            case UsableListChangeTypeId.Insert:
                this.addSubRange(source.list.items, idx, count);
                break;
            case UsableListChangeTypeId.BeforeReplace:
                this.removeSourceSubRange(source.list, idx, count);
                break;
            case UsableListChangeTypeId.AfterReplace:
                this.addSubRange(source.list.items, idx, count);
                break;
            case UsableListChangeTypeId.BeforeMove:
            case UsableListChangeTypeId.AfterMove:
                // nothing to do
                break;
            case UsableListChangeTypeId.Remove:
                if (count === this.count) {
                    this.clear();
                } else {
                    this.removeSourceSubRange(source.list, idx, count);
                }
                break;
            case UsableListChangeTypeId.Clear: {
                this.clearSource(source.list);
                break;
            }
            default:
                throw new UnreachableCaseError('RLIILDHSLCE20208', listChangeTypeId);
        }
    }

    // private handleSourceListChangeEvent(source: RankedDataIvemIdListDirectory.Source, listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
    //     switch (listChangeTypeId) {
    //         case UsableListChangeTypeId.Unusable:
    //             break; // handled through badness change
    //         case UsableListChangeTypeId.PreUsableAdd:
    //             this.enqueueSourceRecordRangeListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.InsertSourceRange, source, idx, count);
    //             break;
    //         case UsableListChangeTypeId.PreUsableClear:
    //             if (source.list.count > 0) {
    //                 this.enqueueListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.ClearSource, source, []);
    //             }
    //             break;
    //         case UsableListChangeTypeId.Usable:
    //             // handled through badness change
    //             break;
    //         case UsableListChangeTypeId.Insert:
    //             if (source.list.usable) {
    //                 this.enqueueSourceRecordRangeListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.InsertSourceRange, source, idx, count);
    //             }
    //             break;
    //         case UsableListChangeTypeId.BeforeReplace:
    //             if (source.list.usable) {
    //                 this.enqueueSourceRecordRangeListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.RemoveSourceRange, source, idx, count);
    //             }
    //             break;
    //         case UsableListChangeTypeId.AfterReplace:
    //             if (source.list.usable) {
    //                 this.enqueueSourceRecordRangeListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.InsertSourceRange, source, idx, count);
    //             }
    //             break;
    //         case UsableListChangeTypeId.BeforeMove:
    //             if (source.list.usable) {
    //                 const { fromIndex, toIndex: ignoredToIndex, count: moveCount } = UsableListChangeType.getMoveParameters(idx); // idx is actually move parameters registration index
    //                 this.enqueueSourceRecordRangeListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.RemoveSourceRange, source, fromIndex, moveCount);
    //             }
    //             break;
    //         case UsableListChangeTypeId.AfterMove:
    //             if (source.list.usable) {
    //                 const { fromIndex: ignoredFromIndex, toIndex, count: moveCount } = UsableListChangeType.getMoveParameters(idx); // idx is actually move parameters registration index
    //                 this.enqueueSourceRecordRangeListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.InsertSourceRange, source, toIndex, moveCount);
    //             }
    //             break;
    //         case UsableListChangeTypeId.Remove:
    //             if (source.list.usable) {
    //                 this.enqueueSourceRecordRangeListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.RemoveSourceRange, source, idx, count);
    //             }
    //             break;
    //         case UsableListChangeTypeId.Clear:
    //             if (source.list.count > 0) {
    //                 this.enqueueListChangeAndProcess(RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.ClearSource, source, []);
    //             }
    //             break;
    //         default:
    //             throw new UnreachableCaseError('RLIILDHSLCE20208', listChangeTypeId);
    //     }
    // }

    // private enqueueSourceRecordRangeListChangeAndProcess(
    //     changeTypeId: RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.InsertSourceRange | RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.RemoveSourceRange,
    //     source: RankedDataIvemIdListDirectory.Source,
    //     rangeStartIndex: Integer,
    //     rangeLength: Integer
    // ) {
    //     const sourceList = source.list;
    //     const items = new Array<RankedDataIvemIdListDirectoryItem>(rangeLength);
    //     let index = rangeStartIndex;
    //     for (let i = 0; i < rangeLength; i++) {
    //         const item = sourceList.getAt(index++);
    //         items[i] = item;
    //     }
    //     this.enqueueListChangeAndProcess(changeTypeId, source, items);
    // }

    // private enqueueListChangeAndProcess(
    //     typeId: RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId,
    //     source: RankedDataIvemIdListDirectory.Source | undefined,
    //     items: RankedDataIvemIdListDirectoryItem[],
    // ) {
    //     const change: RankedDataIvemIdListDirectory.ListChangeQueue.Change = {
    //         source,
    //         typeId,
    //         items,
    //     };
    //     this._listChangeQueue.enqueue(change);
    //     this.processListChangeQueue();
    // }

    // private processListChangeQueue() {
    //     if (!this._listChangeProcessing) {
    //         const change = this._listChangeQueue.dequeue();
    //         if (change !== undefined) {
    //             switch (change.typeId) {
    //                 case RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.Open: {
    //                     this.processOpenListChange(); // async
    //                     break;
    //                 }
    //                 case RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.InsertSourceRange: {
    //                     const source = change.source;
    //                     if (source === undefined) {
    //                         throw new AssertInternalError('RLIILDPLCQI51071');
    //                     } else {
    //                         this.processInsertSourceRangeListChange(source, change.items); // async
    //                     }
    //                     break;
    //                 }
    //                 case RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.RemoveSourceRange: {
    //                     const source = change.source;
    //                     if (source === undefined) {
    //                         throw new AssertInternalError('RLIILDPLCQI51071');
    //                     } else {
    //                         this.processRemoveSourceRangeListChange(source, change.items);
    //                     }
    //                     break;
    //                 }
    //                 case RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.ClearSource: {
    //                     const source = change.source;
    //                     if (source === undefined) {
    //                         throw new AssertInternalError('RLIILDPLCQI51071');
    //                     } else {
    //                         this.processClearSourceListChange(source);
    //                     }
    //                     break;
    //                 }
    //                 case RankedDataIvemIdListDirectory.ListChangeQueue.Change.TypeId.Close: {
    //                     this.processCloseListChange();
    //                     break;
    //                 }
    //                 default:
    //                     throw new UnreachableCaseError('RLIILDPLCQD51071', change.typeId);
    //             }
    //         }
    //     }
    // }

    // private processOpenListChange() {
    //     const sourceCount = this._sources.length;
    //     if (sourceCount === 0) {
    //         this.processListChangeQueue(); // nothing to do - check queue again
    //     } else {
    //         this._listChangeProcessing = true;

    //         let itemCount = 0;
    //         for (const source of this._sources) {
    //             const sourceList = source.list;
    //             if (sourceList.usable) {
    //                 itemCount += sourceList.count;
    //             }
    //         }

    //         this._itemList.capacity = itemCount;

    //         // unlock everything asynchronously
    //         const sourcePromises = new Array<Promise<Result<RankedDataIvemIdListDirectoryItem>[]>>(sourceCount)
    //         const usableSources = new Array<RankedDataIvemIdListDirectory.Source>(sourceCount);
    //         let usableCount = 0;
    //         for (let i = 0; i < sourceCount; i++) {
    //             const source = this._sources[i];
    //             const sourceList = source.list;
    //             if (sourceList.usable) {
    //                 usableSources[usableCount] = source;
    //                 sourcePromises[usableCount] = sourceList.lockAllItems(this._locker);
    //                 usableCount++;
    //             }
    //         }

    //         sourcePromises.length = usableCount;

    //         // wait till all unlocked
    //         const allPromise = Promise.all(sourcePromises);

    //         allPromise.then(
    //             (allSourcesLockResults) => {
    //                 if (usableCount !== allSourcesLockResults.length) {
    //                     throw new AssertInternalError('RLIILDPOLCC10512', `${usableCount}, ${allSourcesLockResults.length}`);
    //                 } else {
    //                     const firstAddIndex = this._itemList.count;
    //                     let addCount = 0;
    //                     for (let i = 0; i < usableCount; i++) {
    //                         const sourceLockResults = allSourcesLockResults[i];
    //                         const source = usableSources[i];
    //                         const maxSourceLockedCount = sourceLockResults.length;
    //                         const sourceLockedItems = new Array<RankedDataIvemIdListDirectoryItem>(maxSourceLockedCount);
    //                         let sourceLockedCount = 0;
    //                         for (const lockResult of sourceLockResults)  {
    //                             if (lockResult.isOk()) {
    //                                 const item = lockResult.value;
    //                                 this._itemList.add(item);
    //                                 sourceLockedItems[sourceLockedCount++] = item;
    //                             }
    //                         }
    //                         sourceLockedItems.length = sourceLockedCount;
    //                         source.lockedItems = [...source.lockedItems, ...sourceLockedItems];
    //                         addCount += sourceLockedCount;
    //                     }
    //                     this.notifyListChange(UsableListChangeTypeId.Insert, firstAddIndex, addCount);

    //                     this.updateBadness(undefined);

    //                     this._listChangeProcessing = false;
    //                     this.processListChangeQueue(); // check queue
    //                 }
    //             },
    //             (error) => { throw AssertInternalError.createIfNotError(error, 'RLIILDPOLCE10512') }
    //         );
    //     }
    // }

    // private processCloseListChange() {
    //     this._listChangeProcessing = true;

    //     const itemCount = this._itemList.count;
    //     if (itemCount > 0) {
    //         this.notifyListChange(UsableListChangeTypeId.Clear, 0, itemCount);
    //         this._itemList.clear();

    //         for (const source of this._sources) {
    //             const sourceLockedItems = source.lockedItems;
    //             if (sourceLockedItems.length > 0) {
    //                 source.list.unlockItems(sourceLockedItems, this._locker);
    //                 source.lockedItems = [];
    //             }
    //         }
    //     }

    //     this._listChangeProcessing = false;
    //     this.processListChangeQueue(); // check queue
    // }

    // private processInsertSourceRangeListChange(source: RankedDataIvemIdListDirectory.Source, items: RankedDataIvemIdListDirectoryItem[]) {
    //     const sourceList = source.list;
    //     if (sourceList.usable) {
    //         const lockResultsPromise = sourceList.lockItems(items, this._locker);
    //         lockResultsPromise.then(
    //             (lockResults) => {
    //                 const firstAddIndex = this._itemList.count;
    //                 const lockedItems = new Array<RankedDataIvemIdListDirectoryItem>(items.length);
    //                 let addCount = 0;
    //                 for (const lockResult of lockResults)  {
    //                     if (lockResult.isOk()) {
    //                         const item = lockResult.value;
    //                         if (item !== undefined) {
    //                             this._itemList.add(item);
    //                             lockedItems[addCount++] = item;
    //                         }
    //                     }
    //                 }
    //                 lockedItems.length = addCount;
    //                 source.lockedItems = [...source.lockedItems, ...lockedItems];

    //                 this.notifyListChange(UsableListChangeTypeId.Insert, firstAddIndex, addCount);

    //                 this._listChangeProcessing = false;
    //                 this.processListChangeQueue(); // check queue
    //             },
    //             (error) => { throw AssertInternalError.createIfNotError(error, 'RLIILDPCLCE10512') }
    //         );
    //     }
    // }

    // private processRemoveSourceRangeListChange(source: RankedDataIvemIdListDirectory.Source, items: RankedDataIvemIdListDirectoryItem[]) {
    //     this._listChangeProcessing = true;

    //     const sourceList = source.list;
    //     const itemCount = items.length;
    //     const itemListCount  = this._itemList.count;
    //     if (itemCount === itemListCount) {
    //         // clear
    //         this.notifyListChange(UsableListChangeTypeId.Clear, 0, itemCount);
    //         this._itemList.clear();

    //         sourceList.unlockItems(items, this._locker);
    //         source.lockedItems = [];
    //     } else {
    //         this._itemList.removeItems(
    //             items,
    //             (idx, count) => { this.notifyListChange(UsableListChangeTypeId.Remove, idx, count); }
    //         );
    //         const lockedItems = source.lockedItems;
    //         const oldLockedItemCount = lockedItems.length;
    //         removeFromArray(lockedItems, items);
    //         if (lockedItems.length !== oldLockedItemCount - itemCount) {
    //             throw new AssertInternalError('RLIILDPRSRLC41081', `${lockedItems.length}, ${oldLockedItemCount}, ${itemCount}`);
    //         }
    //     }

    //     this._listChangeProcessing = false;
    //     this.processListChangeQueue(); // check queue
    // }

    // private processClearSourceListChange(source: RankedDataIvemIdListDirectory.Source) {
    //     const lockedItems = source.lockedItems;
    //     this.processRemoveSourceRangeListChange(source, lockedItems);
    // }

    private clearSource(sourceList: BadnessMappedComparableList<RankedDataIvemIdListDirectoryItem>) {
        const sourceListCount = sourceList.count;
        if (sourceListCount === this.count) {
            this.clear();
        } else {
            this.removeSourceSubRange(sourceList, 0, sourceListCount);
        }
    }

    private removeSourceSubRange(sourceList: BadnessMappedComparableList<RankedDataIvemIdListDirectoryItem>, sourceRangeIndex: Integer, sourceRangeLength: Integer) {
        const items = sourceList.items.slice(sourceRangeIndex, sourceRangeIndex + sourceRangeLength);
        this.removeItems(items);
    }

    private updateBadness(changedSource: RankedDataIvemIdListDirectory.Source | undefined) {
        const sources = this._sources;
        const sourceCount = sources.length;

        const resourceBadnesses = new Array<ResourceBadness>(sourceCount);
        for (let i = 0; i < sourceCount; i++) {
            const source = sources[i];
            if (changedSource === undefined || source === changedSource) {
                this.updateSourceResourceBadness(source);
            }
            resourceBadnesses[i] = source.lastResourceBadness;
        }
        const badness = ResourceBadness.consolidate(resourceBadnesses);
        this.setBadness(badness);
    }

    private updateSourceResourceBadness(source: RankedDataIvemIdListDirectory.Source) {
        const list = source.list;
        const listBadness = list.badness;
        source.lastResourceBadness = {
            reasonId: listBadness.reasonId,
            reasonExtra: listBadness.reasonExtra,
            resourceName: source.badnessResourceName,
        }
    }
}

export namespace RankedDataIvemIdListDirectory {
    export interface NamedSourceList {
        name: string;
        list: BadnessMappedComparableList<RankedDataIvemIdListDirectoryItem>;
    }

    export interface Source {
        readonly list: BadnessMappedComparableList<RankedDataIvemIdListDirectoryItem>;
        readonly badnessResourceName: string;
        lastResourceBadness: ResourceBadness;
        listChangeEventSubscriptionId: MultiEvent.SubscriptionId | undefined;
        badnessChangedEventSubscriptionId: MultiEvent.SubscriptionId | undefined;
    }

    export class ListChangeQueue {
        private readonly _items = new Array<ListChangeQueue.Change>();

        get length() { return this._items.length; }

        enqueue(item: ListChangeQueue.Change) {
            this._items.push(item);
        }

        dequeue() {
            return this._items.shift();
        }
    }

    export namespace ListChangeQueue {
        export interface Change {
            source: Source | undefined;
            typeId: Change.TypeId;
            items: RankedDataIvemIdListDirectoryItem[];
        }

        export namespace Change {
            export const enum TypeId {
                Open,
                InsertSourceRange,
                RemoveSourceRange,
                ClearSource,
                Close,
            }
        }
    }
}
