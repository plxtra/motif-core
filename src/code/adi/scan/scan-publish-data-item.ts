import { DataDefinition, FeedClassId } from '../common/internal-api';
import { FeedSubscriptionDataItem } from '../feed/internal-api';

export abstract class ScanPublishDataItem extends FeedSubscriptionDataItem {
    constructor(definition: DataDefinition) {
        super(definition, FeedClassId.Scanner, undefined);
    }
}
