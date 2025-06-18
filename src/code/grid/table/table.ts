import { RevTable } from 'revgrid';
import { TextFormattableValue } from '../../services';
import { Badness } from "../../sys";
import { TableFieldSourceDefinition } from './field-source/internal-api';
import { TableRecordSourceDefinition } from './record-source/internal-api';

export class Table extends RevTable<
    Badness,
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {
}
