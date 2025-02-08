import { DataMessage, DataMessageTypeId } from '../common/internal-api';
import { ScanPublishDataItem } from './scan-publish-data-item';

export class DeleteScanDataItem extends ScanPublishDataItem {
    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.DeleteScan) {
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
