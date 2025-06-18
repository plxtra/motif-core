import { RevRecordDataServer } from 'revgrid';
import { ScalarSettings } from '../../../services';
import { GridField } from '../../field/internal-api';

export class RecordGridDataServer extends RevRecordDataServer<GridField> {
    applySettings(scalarSettings: ScalarSettings) {
        this.allChangedRecentDuration = scalarSettings.grid_AllChangedRecentDuration;
        this.recordInsertedRecentDuration = scalarSettings.grid_RecordInsertedRecentDuration;
        this.recordUpdatedRecentDuration = scalarSettings.grid_RecordUpdatedRecentDuration;
        this.valueChangedRecentDuration = scalarSettings.grid_ValueChangedRecentDuration;
    }
}
