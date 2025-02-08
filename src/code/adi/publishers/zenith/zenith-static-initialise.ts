import { PhysicalMessageStaticInitialise } from './physical-message/internal-api';
import { ZenithConnectionStateEngineModule } from './zenith-connection-state-engine';

export namespace ZenithStaticInitialise {
    export function initialise() {
        PhysicalMessageStaticInitialise.initialise();
        ZenithConnectionStateEngineModule.initialiseStatic();
    }
}
