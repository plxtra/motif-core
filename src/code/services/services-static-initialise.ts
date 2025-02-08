import { UserAlertServiceModule } from '../services/user-alert-service';
import { CallPutModule } from './call-put';
import { ChartHistoryIntervalModule } from './chart-history-interval';
import { OrderPadModule } from './order-pad';
import { RankedDataIvemIdListDirectoryItemModule } from './ranked-data-ivem-id-list-directory-item';
import { SaveManagementModule } from './save-management';

/** @internal */
export namespace ServicesStaticInitialise {
    export function initialise() {
        UserAlertServiceModule.initialiseStatic();
        CallPutModule.initialiseStatic();
        ChartHistoryIntervalModule.initialiseStatic();
        OrderPadModule.initialiseStatic();
        RankedDataIvemIdListDirectoryItemModule.initialiseStatic();
        SaveManagementModule.initialiseStatic();
    }
}
