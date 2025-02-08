import { BrokerageAccountGroup } from './brokerage-account-group';
import { BrokerageAccountRecord } from './brokerage-account-record';
import { BrokerageAccountRecordList } from './brokerage-account-record-list';

export interface BrokerageAccountGroupRecordList<Record extends BrokerageAccountRecord>
    extends BrokerageAccountRecordList<Record> {

    brokerageAccountGroup: BrokerageAccountGroup;
}
