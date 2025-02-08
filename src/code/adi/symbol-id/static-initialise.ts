import { DataIvemIdModule } from './lit-ivem-id';

export namespace SymbolIdStaticInitialise {
    export function initialise() {
        DataIvemIdModule.initialiseStatic();
    }
}
