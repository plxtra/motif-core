import { Feed } from '../../../adi';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { KeyedCorrectnessTableRecordDefinition } from './keyed-correctness-table-record-definition';
import { TableRecordDefinition } from './table-record-definition';

export interface FeedTableRecordDefinition extends KeyedCorrectnessTableRecordDefinition<Feed> {
    readonly typeId: TableFieldSourceDefinition.TypeId.Feed;
}

export namespace FeedTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is FeedTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.Feed;
    }
}
