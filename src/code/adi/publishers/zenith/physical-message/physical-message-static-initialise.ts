import { ZenithConvertModule } from './zenith-convert';

export namespace PhysicalMessageStaticInitialise {
    export function initialise() {
        ZenithConvertModule.initialiseStatic();
    }
}
