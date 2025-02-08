import { RevTableFieldSourceDefinitionFactory } from '@xilytix/revgrid';
import { TextFormattableValue } from '../../../../services/internal-api';
import { TableFieldSourceDefinition } from './table-field-source-definition';

export interface TableFieldSourceDefinitionFactory extends RevTableFieldSourceDefinitionFactory<
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId> {
}
