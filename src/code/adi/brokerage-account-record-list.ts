import { KeyedCorrectnessList } from '../sys';
import { BrokerageAccountRecord } from './brokerage-account-record';

export interface BrokerageAccountRecordList<Record extends BrokerageAccountRecord> extends KeyedCorrectnessList<Record> {
}
