import {
    AssertInternalError,
    Integer,
    MultiEvent,
    UnreachableCaseError,
    UsableListChangeTypeId
} from '@xilytix/sysutils';
import {
    Badness,
    CorrectnessId,
} from "../../sys/internal-api";
import { DataDefinition, FeedClass, FeedClassId, FeedsDataDefinition } from '../common/internal-api';
import { Feed } from './feed';
import { FeedStatusSubscriptionDataItem } from './feed-status-subscription-data-item';
import { FeedsDataItem } from './feeds-data-item';

export abstract class FeedSubscriptionDataItem extends FeedStatusSubscriptionDataItem {
    private _feedsDataItem: FeedsDataItem;
    private _feedsCorrectnessChangeSubscriptionId: MultiEvent.SubscriptionId;
    private _feedsListChangeSubscriptionId: MultiEvent.SubscriptionId;

    private _feed: Feed | undefined;
    private _feedCorrectnessChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _feedStatusChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        definition: DataDefinition,
        readonly feedClassId: FeedClassId,
        readonly feedZenithCodeOrFirstInClass: string | undefined,
        private readonly _useListFeedCorrectness = false
    ) {
        super(definition);
    }

    get feed() { return this._feed; } // not to be cached
    get feeds() { return this._feedsDataItem.records; }
    get feedsUsable() { return this._feedsDataItem.usable; }

    // setFeed(classId: FeedClassId, zenithFeedName: string | undefined) {
    //     super.setFeed(classId, zenithFeedName);
    //     // eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-unnecessary-condition
    //     if (this._feedsDataItem !== undefined && this._feedsDataItem.usable) {
    //         this.checkFeed();
    //     }
    // }

    protected override start() {
        const feedsDataDefinition = new FeedsDataDefinition();
        this._feedsDataItem = this.subscribeDataItem(feedsDataDefinition) as FeedsDataItem;

        this._feedsCorrectnessChangeSubscriptionId = this._feedsDataItem.subscribeCorrectnessChangedEvent(
            () => { this.handleFeedsCorrectnessChangedEvent(); }
        );

        this._feedsListChangeSubscriptionId = this._feedsDataItem.subscribeListChangeEvent(
            (listChangeType, index, count) => { this.handleFeedsListChangeEvent(listChangeType, index, count); }
        );

        super.start();

        if (this._feedsDataItem.usable) {
            this.checkFeed();
        } else {
            this.setFeedsUnusableBadness();
        }
    }

    protected override stop() {
        super.stop();

        this.clearFeed();

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._feedsDataItem !== undefined) {
            this._feedsDataItem.unsubscribeListChangeEvent(this._feedsListChangeSubscriptionId);
            this._feedsDataItem.unsubscribeCorrectnessChangedEvent(this._feedsCorrectnessChangeSubscriptionId);
            this.unsubscribeDataItem(this._feedsDataItem);
            this._feedsDataItem = undefined as unknown as FeedsDataItem;
        }
    }

    protected getFeed(classId: FeedClassId, zenithFeedCode: string | undefined) {
        return this._feedsDataItem.getFeed(classId, zenithFeedCode);
    }

    /** Give descendants an opportunity to initialise data using Feed */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected processFeedBecameAvailable() {
    }

    protected override getFeedDisplay(): string {
        if (this._feed === undefined) {
            return FeedClass.generateFeedDisplay(this.feedClassId, '<undefined>');
        } else {
            return FeedClass.generateFeedDisplay(this.feedClassId, this._feed.zenithCode);
        }
    }

    protected override calculateUsabilityBadness() {
        // Normally would priortise badness from base class.  However subscription cannot come online without Feed or Feed Data
        // So if Feed or Feed Data not available, prioritise this badness
        if (this._feed === undefined) {
            if (!this._feedsDataItem.usable) {
                return this.calculateFeedsUnusableBadness();
            } else {
                // if (this.zenithFeedName === undefined) {
                //     return super.calculateUsabilityBadness();
                // } else {
                    return {
                        reasonId: Badness.ReasonId.FeedNotAvailable,
                        reasonExtra: this.getFeedDisplay(),
                    };
                // }
            }
        } else {
            const feedUsable = this._useListFeedCorrectness ? this._feed.baseUsable : this._feed.usable;
            if (!feedUsable) {
                return this.calculateFeedUnusableBadness(this._feed);
            } else {
                return super.calculateUsabilityBadness();
            }
        }
    }

    private handleFeedsCorrectnessChangedEvent() {
        if (!this._feedsDataItem.usable) {
            this.setFeedsUnusableBadness();
        } else {
            this.checkFeed();
        }
    }

    private handleFeedsListChangeEvent(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        this.processFeedsListChange(listChangeTypeId, index, count);
    }

    private processFeedsListChange(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                this.setUnusable(this._feedsDataItem.badness);
                break;
            case UsableListChangeTypeId.PreUsableClear:
                this.clearFeed();
                break;
            case UsableListChangeTypeId.PreUsableAdd:
                // no action
                break;
            case UsableListChangeTypeId.Usable:
                this.checkFeed();
                break;
            case UsableListChangeTypeId.Insert:
                this.checkFeed();
                break;
            case UsableListChangeTypeId.BeforeReplace:
                throw new AssertInternalError('FSDIPFLCBR19662', this.definition.description);
            case UsableListChangeTypeId.AfterReplace:
                throw new AssertInternalError('FSDIPFLCAR19662', this.definition.description);
            case UsableListChangeTypeId.BeforeMove:
                throw new AssertInternalError('FSDIPFLCBM19662', this.definition.description);
            case UsableListChangeTypeId.AfterMove:
                throw new AssertInternalError('FSDIPFLCAM19662', this.definition.description);
            case UsableListChangeTypeId.Remove:
                this.checkClearFeed(index, count);
                break;
            case UsableListChangeTypeId.Clear:
                this.clearFeed();
                break;
            default:
                throw new UnreachableCaseError('FSDIPMLCU10009134', listChangeTypeId);
        }
    }

    private checkFeed() {
        if (this._feed === undefined) {
            const feed = this._feedsDataItem.getFeed(this.feedClassId, this.feedZenithCodeOrFirstInClass);
            if (feed !== undefined) {
                this._feed = feed;

                if (this._useListFeedCorrectness) {
                    this._feedCorrectnessChangedSubscriptionId = feed.subscribeListCorrectnessChangedEvent(
                        () => { this.updateFeedStatusId(); }
                    );
                } else {
                    this._feedCorrectnessChangedSubscriptionId = feed.subscribeCorrectnessChangedEvent(
                        () => { this.updateFeedStatusId(); }
                    );
                }
                this._feedStatusChangeSubscriptionId = feed.subscribeStatusChangedEvent(
                    () => { this.updateFeedStatusId(); }
                );
                this.updateFeedStatusId();
                this.processFeedBecameAvailable();
            }
        }
    }

    private clearFeed() {
        if (this._feed !== undefined) {
            if (this._useListFeedCorrectness) {
                this._feed.unsubscribeListCorrectnessChangedEvent(this._feedCorrectnessChangedSubscriptionId);
            } else {
                this._feed.unsubscribeCorrectnessChangedEvent(this._feedCorrectnessChangedSubscriptionId);
            }
            this._feedCorrectnessChangedSubscriptionId = undefined;
            this._feed.unsubscribeStatusChangedEvent(this._feedStatusChangeSubscriptionId);
            this._feedStatusChangeSubscriptionId = undefined;
            this._feed = undefined;
            this.setFeedStatusId(undefined);
        }
    }

    private checkClearFeed(index: Integer, count: Integer) {
        if (this._feed !== undefined) {
            for (let i = index; i < index + count; i++) {
                const feed = this._feedsDataItem.records[i];
                if (feed === this._feed) {
                    this.clearFeed();
                    return;
                }
            }
        }
    }

    private updateFeedStatusId() {
        if (this._feed === undefined) {
            this.setFeedStatusId(undefined);
        } else {
            const feedUsable = this._useListFeedCorrectness ? this._feed.baseUsable : this._feed.usable;
            if (!feedUsable) {
                this.setFeedStatusId(undefined);
            } else {
                this.setFeedStatusId(this._feed.statusId);
            }
        }
    }

    private setFeedsUnusableBadness() {
        const badness = this.calculateFeedsUnusableBadness();
        this.setUnusable(badness);
    }

    private calculateFeedsUnusableBadness() {
        if (this._feedsDataItem.error) {
            return {
                reasonId: Badness.ReasonId.FeedsError,
                reasonExtra: '',
            };
        } else {
            return {
                reasonId: Badness.ReasonId.FeedsWaiting,
                reasonExtra: '',
            };
        }
    }

    private calculateFeedUnusableBadness(feed: Feed) {
        if (feed.correctnessId === CorrectnessId.Error) {
            return {
                reasonId: Badness.ReasonId.FeedError,
                reasonExtra: Feed.name,
            };
        } else {
            return {
                reasonId: Badness.ReasonId.FeedWaiting,
                reasonExtra: Feed.name,
            };
        }
    }
}
