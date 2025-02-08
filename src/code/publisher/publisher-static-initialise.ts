import { PublisherIdModule } from './publisher-id';

/** @internal */
export namespace PublisherStaticInitialise {
    export function initialise() {
        PublisherIdModule.initialiseStatic();
    }
}
