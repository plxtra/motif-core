import { AllBrokerageAccountRecordsDataItem } from './all-brokerage-account-records-data-item';
import { Balances } from './balances';
import { BrokerageAccountGroupRecordList } from './brokerage-account-group-record-list';
import { BrokerageAccountBalancesDataDefinition } from './common/internal-api';

export class AllBalancesDataItem extends AllBrokerageAccountRecordsDataItem<Balances> implements BrokerageAccountGroupRecordList<Balances> {

    protected createRecordsDataDefinition(accountZenithCode: string) {
        return new BrokerageAccountBalancesDataDefinition(accountZenithCode);
    }
}
