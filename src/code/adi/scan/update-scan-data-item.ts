import { DataMessage, DataMessageTypeId } from '../common/internal-api';
import { ScanPublishDataItem } from './scan-publish-data-item';

export class UpdateScanDataItem extends ScanPublishDataItem {
    override processMessage(msg: DataMessage) {
        if (msg.typeId !== DataMessageTypeId.UpdateScan) {
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
