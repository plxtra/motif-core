import { TableFieldSourceStaticInitialise } from './field-source/internal-api';
import { TableRecordSourceStaticInitialise } from './record-source/internal-api';

/** @internal */
export namespace TableStaticInitialise {
    export function initialise() {
        TableRecordSourceStaticInitialise.initialise();
        TableFieldSourceStaticInitialise.initialise();
    }
}
