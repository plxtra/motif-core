import { RevTableFieldSourceDefinitionFactory } from 'revgrid';
import { TextFormattableValue } from '../../../../services';
import { TableFieldSourceDefinition } from './table-field-source-definition';

export interface TableFieldSourceDefinitionFactory extends RevTableFieldSourceDefinitionFactory<
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId> {
}
