import { RevTable } from '@xilytix/revgrid';
import { TextFormattableValue } from '../../services/internal-api';
import { Badness } from "../../sys/internal-api";
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
