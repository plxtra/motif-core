import { RevReferenceableDataSource } from '@xilytix/revgrid';
import { TextFormattableValue } from '../../services/internal-api';
import { Badness } from '../../sys/internal-api';
import { TableFieldSourceDefinition, TableRecordSourceDefinition } from '../table/internal-api';

export class ReferenceableDataSource extends RevReferenceableDataSource<
    Badness,
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {

}
