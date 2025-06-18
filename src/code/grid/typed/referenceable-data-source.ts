import { RevReferenceableDataSource } from 'revgrid';
import { TextFormattableValue } from '../../services';
import { Badness } from '../../sys';
import { TableFieldSourceDefinition, TableRecordSourceDefinition } from '../table/internal-api';

export class ReferenceableDataSource extends RevReferenceableDataSource<
    Badness,
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {

}
