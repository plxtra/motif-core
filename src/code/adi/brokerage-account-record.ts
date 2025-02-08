import { KeyedCorrectnessListItem, MapKey } from '../sys/internal-api';

export interface BrokerageAccountRecord extends KeyedCorrectnessListItem {
    readonly accountMapKey: MapKey;
}
