import { MarketIvemId, RankedDataIvemId } from '../../../adi';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { TableRecordDefinition } from './table-record-definition';

export interface RankedDataIvemIdTableRecordDefinition extends TableRecordDefinition {
    readonly typeId: TableFieldSourceDefinition.TypeId.RankedDataIvemId;
    readonly rankedDataIvemId: RankedDataIvemId;
}

export namespace RankedDataIvemIdTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is RankedDataIvemIdTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.RankedDataIvemId;
    }

    export function createMapKey(rankedDataIvemId: RankedDataIvemId) {
        return MarketIvemId.createMapKey(rankedDataIvemId.dataIvemId);
    }
}

