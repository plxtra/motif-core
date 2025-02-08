import { InternalCommandModule } from './internal-command';

/** @internal */
export namespace CommandStaticInitialise {
    export function initialise() {
        InternalCommandModule.initialiseStatic();
    }
}
