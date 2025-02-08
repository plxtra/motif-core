import { AllBrokerageAccountRecordsDataItem } from './all-brokerage-account-records-data-item';
import { BrokerageAccountGroupOrderList } from './brokerage-account-group-order-list';
import { BrokerageAccountOrdersDataDefinition } from './common/internal-api';
import { Order } from './order';

export class AllOrdersDataItem extends AllBrokerageAccountRecordsDataItem<Order> implements BrokerageAccountGroupOrderList {

    protected createRecordsDataDefinition(accountZenithCode: string) {
        return new BrokerageAccountOrdersDataDefinition(accountZenithCode);
    }
}
