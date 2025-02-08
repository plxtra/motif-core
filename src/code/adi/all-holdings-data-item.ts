import { AllBrokerageAccountRecordsDataItem } from './all-brokerage-account-records-data-item';
import { BrokerageAccountGroupHoldingList } from './brokerage-account-group-holding-list';
import { BrokerageAccountHoldingsDataDefinition } from './common/internal-api';
import { Holding } from './holding';

export class AllHoldingsDataItem extends AllBrokerageAccountRecordsDataItem<Holding> implements BrokerageAccountGroupHoldingList {

    protected createRecordsDataDefinition(accountZenithCode: string) {
        return new BrokerageAccountHoldingsDataDefinition(accountZenithCode);
    }
}
