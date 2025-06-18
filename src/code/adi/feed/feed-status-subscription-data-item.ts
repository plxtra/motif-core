import { Badness } from '../../sys';
import { FeedStatus, FeedStatusId, SubscribabilityExtentId } from '../common/internal-api';
import { SubscribabilityExtentSubscriptionDataItem } from '../publish-subscribe/internal-api';

export abstract class FeedStatusSubscriptionDataItem extends SubscribabilityExtentSubscriptionDataItem {
    // private _feedId: FeedId | undefined;
    private _feedStatusId: FeedStatusId | undefined;

    // get feedId() { return this._zenithFeedName; }

    // setFeedId(value: FeedId) {
    //     this._feedId = value;
    // }

    protected setFeedStatusId(value: FeedStatusId | undefined) {
        if (value !== this._feedStatusId) {
            this._feedStatusId = value;
            const subscribabilityExtentId = this._feedStatusId === undefined ? SubscribabilityExtentId.None : FeedStatus.idToSubscribabilityExtentId(this._feedStatusId);
            this.setSubscribabilityExtent(subscribabilityExtentId);
        }
    }

    protected override calculateUsabilityBadness() {
        const badness = super.calculateUsabilityBadness();
        if (Badness.isUnusable(badness)) {
            return badness;
        } else {
            return this.createFeedBadness();
        }
    }

    private createFeedBadness() {
        let badness: Badness;
        if (this._feedStatusId !== undefined) {
            // let reasonExtra: string;
            // if (this._feedId === undefined) {
            //     reasonExtra = `${Strings[StringId.FeedFieldDisplay_FeedId]} ${Strings[StringId.Unknown]}`;
            // } else {
            //     reasonExtra = FeedInfo.idToDisplay(this._feedId);
            // }
            badness = {
                reasonId: FeedStatus.idToBadnessReasonId(this._feedStatusId),
                reasonExtra: this.getFeedDisplay(),
            };
        } else {
            // if (this._feedId !== undefined) {
            //     badness = {
            //         reasonId: Badness.ReasonId.FeedStatus_Unknown,
            //         reasonExtra: FeedInfo.idToDisplay(this._feedId),
            //     };
            // } else {
                badness = {
                    reasonId: Badness.ReasonId.FeedNotAvailable,
                    reasonExtra: '',
                };
            // }
        }
        return badness;
    }

    protected abstract getFeedDisplay(): string;
}
