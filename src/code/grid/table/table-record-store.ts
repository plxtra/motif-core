import { RevTableRecordStore } from '@xilytix/revgrid';
import { TextFormattableValue } from '../../services/internal-api';
import { Badness } from "../../sys/internal-api";
import { TableFieldSourceDefinition } from './field-source/internal-api';
import { TableRecordSourceDefinition } from './record-source/internal-api';

/** @public */
export class TableRecordStore extends RevTableRecordStore<
    Badness,
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {
}
