import { KeyedCorrectnessListItem } from '../../sys';
import { DataIvemId } from './data-ivem-id';

export interface DataIvemIdKeyedCorrectnessListItem extends KeyedCorrectnessListItem {
    readonly dataIvemId: DataIvemId;
}
