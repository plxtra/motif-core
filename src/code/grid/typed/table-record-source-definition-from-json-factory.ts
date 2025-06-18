import { RevTableRecordSourceDefinitionFromJsonFactory } from 'revgrid';
import { TextFormattableValue } from '../../services';
import { TableFieldSourceDefinition, TableRecordSourceDefinition } from '../table/internal-api';

export type TableRecordSourceDefinitionFromJsonFactory = RevTableRecordSourceDefinitionFromJsonFactory<
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
>;
