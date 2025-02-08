import { DataMessage, DataMessageTypeId, WatchmakerListDataIvemIdsDataMessage } from '../common/internal-api';
import { DataIvemIdKeyedCorrectnessListItem } from '../symbol-id/internal-api';
import { WatchmakerListMembersDataItem } from './watchmaker-list-members-data-item';

export class DataIvemIdWatchmakerListMembersDataItem extends WatchmakerListMembersDataItem<DataIvemIdKeyedCorrectnessListItem> {
    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.WatchmakerListDataIvemIds) {
            super.processMessage(msg);
        } else {
            this.beginUpdate();
            try {
                this.advisePublisherResponseUpdateReceived();
                this.notifyUpdateChange();
                const dataIvemIdsMsg = msg as WatchmakerListDataIvemIdsDataMessage;
                this.processIrrcChanges(dataIvemIdsMsg.changes);
            } finally {
                this.endUpdate();
            }
        }
    }
}
