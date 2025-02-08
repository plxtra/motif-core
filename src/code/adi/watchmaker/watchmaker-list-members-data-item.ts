import { DataDefinition, FeedClassId } from '../common/internal-api';
import { IrrcFeedSubscriptionDataItem } from '../feed/internal-api';

export abstract class WatchmakerListMembersDataItem<T> extends IrrcFeedSubscriptionDataItem<T> {
    constructor(definition: DataDefinition) {
        super(definition, FeedClassId.Watchlist, undefined)
    }
}
