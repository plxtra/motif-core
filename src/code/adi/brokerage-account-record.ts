import { MapKey } from '@pbkware/js-utils';
import { KeyedCorrectnessListItem } from '../sys';

export interface BrokerageAccountRecord extends KeyedCorrectnessListItem {
    readonly accountMapKey: MapKey;
}
