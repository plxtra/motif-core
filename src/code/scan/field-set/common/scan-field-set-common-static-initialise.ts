import { ScanFieldSetLoadErrorModule } from './scan-field-set-load-error';

/** @internal */
export namespace ScanFieldSetCommonStaticInitialise {
    export function initialise() {
        ScanFieldSetLoadErrorModule.initialise();
    }
}
