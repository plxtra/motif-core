import { DataDefinition, FeedClassId } from '../common/internal-api';
import { FeedSubscriptionDataItem } from '../feed/internal-api';

export abstract class NotificationChannelPublishDataItem extends FeedSubscriptionDataItem {
    constructor(definition: DataDefinition) {
        super(definition, FeedClassId.Scanner, undefined);
    }
}
