import { RevTableRecordStore } from 'revgrid';
import { TextFormattableValue } from '../../services';
import { Badness } from "../../sys";
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
