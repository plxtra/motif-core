import { RankedDataIvemIdModule } from '../adi/scan/ranked-data-ivem-id';
import { RankedDataIvemIdListDefinitionStaticInitialise } from './definition/ranked-data-ivem-id-list-definition-static-initialise';

/** @internal */
export namespace RankedDataIvemIdListStaticInitialise {
    export function initialise() {
        RankedDataIvemIdListDefinitionStaticInitialise.initialise();
        RankedDataIvemIdModule.initialiseStatic();
    }
}
