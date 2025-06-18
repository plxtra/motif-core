import { RevTableFieldSourceDefinitionCachingFactory } from 'revgrid';
import { TextFormattableValue } from '../../../../services';
import { TableFieldSourceDefinition } from './table-field-source-definition';

export interface TableFieldSourceDefinitionCachingFactory extends RevTableFieldSourceDefinitionCachingFactory<
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {

}
