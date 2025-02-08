import { TableRecordSourceDefinitionStaticInitialise } from './definition/internal-api';

/** @internal */
export namespace TableRecordSourceStaticInitialise {
    export function initialise() {
        TableRecordSourceDefinitionStaticInitialise.initialise();
    }
}
