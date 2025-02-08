import { DataMessage, DataMessageTypeId } from '../common/internal-api';
import { NotificationChannelPublishDataItem } from './notification-channel-publish-data-item';

export class UpdateNotificationChannelEnabledDataItem extends NotificationChannelPublishDataItem {
    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.UpdateNotificationChannelEnabled) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                this.advisePublisherResponseUpdateReceived();
                this.notifyUpdateChange();
            } finally {
                this.endUpdate();
            }
        }
    }
}
