import { ZenithStaticInitialise } from './zenith/internal-api';

export namespace PublishersStaticInitialise {
    export function initialise() {
        ZenithStaticInitialise.initialise();
    }
}
