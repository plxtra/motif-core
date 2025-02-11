import { AssertInternalError, IndexedRecord } from '@xilytix/sysutils';
import { TextFormattableValue } from '../../../services/internal-api';
import { GridField } from '../../field/internal-api';

export class RowDataArrayGridField extends GridField {
    override getViewValue(_record: IndexedRecord): TextFormattableValue {
        throw new AssertInternalError('RDAGFGVV22211'); // not used in RowDataArray grids
    }
}
