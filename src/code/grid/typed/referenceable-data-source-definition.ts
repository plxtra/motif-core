import { RevReferenceableDataSourceDefinition } from 'revgrid';
import { TextFormattableValue } from '../../services/internal-api';
import { TableFieldSourceDefinition, TableRecordSourceDefinition } from '../table/internal-api';

export class ReferenceableDataSourceDefinition extends RevReferenceableDataSourceDefinition<
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {

}

