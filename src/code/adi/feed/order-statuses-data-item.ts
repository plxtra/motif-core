import { assert, AssertInternalError, UnexpectedTypeError } from '../../sys/internal-api';
import { DataDefinition, DataMessage, DataMessageTypeId, FeedClass, FeedClassId, FeedStatusId, OrderStatus, OrderStatuses, OrderStatusesDataDefinition, OrderStatusesDataMessage } from '../common/internal-api';
import { FeedStatusSubscriptionDataItem } from './feed-status-subscription-data-item';

export class OrderStatusesDataItem extends FeedStatusSubscriptionDataItem {
    private readonly _feedClassId: FeedClassId;
    private readonly _feedZenithCode: string;

    private _orderStatuses: OrderStatuses;
    private _waitingStartedFeedStatusId: FeedStatusId | undefined;

    constructor(definition: DataDefinition) {
        super(definition);

        if (!(definition instanceof OrderStatusesDataDefinition)) {
            throw new AssertInternalError('OSDIC23008', definition.description);
        } else {
            this._feedClassId = FeedClassId.Trading;
            this._feedZenithCode = definition.tradingFeedZenithCode;
        }
    }

    get orderStatuses() { return this._orderStatuses; }

    override setFeedStatusId(value: FeedStatusId) {
        if (this.started) {
            super.setFeedStatusId(value);
        } else {
            this._waitingStartedFeedStatusId = value;
        }
    }

    override processMessage(msg: DataMessage) { // virtual;
        if (msg.typeId !== DataMessageTypeId.OrderStatuses) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                this.advisePublisherResponseUpdateReceived();
                this.notifyUpdateChange();

                if (msg instanceof OrderStatusesDataMessage) {
                    this.processOrderStatusesDataMessage(msg);
                } else {
                    throw new UnexpectedTypeError('OSDIPM33855', '');
                }
            } finally {
                this.endUpdate();
            }
        }
    }

    findStatus(code: string): OrderStatus | undefined {
        for (let i = 0; i < this._orderStatuses.length; i++) {
            const status = this._orderStatuses[i];
            if (status.code === code) {
                return status;
            }
        }
        return undefined;
    }

    protected override start() {
        super.start();

        if (this._waitingStartedFeedStatusId !== undefined) {
            this.setFeedStatusId(this._waitingStartedFeedStatusId);
            this._waitingStartedFeedStatusId = undefined;
        }
    }

    protected override processSubscriptionPreOnline() { // virtual
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._orderStatuses !== undefined && this._orderStatuses.length > 0) {
            this.beginUpdate();
            try {
                this.notifyUpdateChange();
                this._orderStatuses = [];
            } finally {
                this.endUpdate();
            }
        }
    }

    protected override getFeedDisplay(): string {
        return FeedClass.generateFeedDisplay(this._feedClassId, this._feedZenithCode);
    }

    private processOrderStatusesDataMessage(msg: OrderStatusesDataMessage): void {
        assert(msg instanceof OrderStatusesDataMessage, 'ID:10206103657');
        this._orderStatuses = msg.statuses;
    }
}
