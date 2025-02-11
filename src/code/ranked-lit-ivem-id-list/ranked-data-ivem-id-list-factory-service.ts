import { UnreachableCaseError } from '@xilytix/sysutils';
import { AdiService } from '../adi/internal-api';
import { ScansService } from '../scan/internal-api';
import { WatchmakerService } from '../watchmaker/internal-api';
import { DataIvemIdArrayRankedDataIvemIdList } from './data-ivem-id-array-ranked-data-ivem-id-list';
import { DataIvemIdExecuteScanRankedDataIvemIdList } from './data-ivem-id-execute-scan-ranked-data-ivem-id-list';
import {
    DataIvemIdArrayRankedDataIvemIdListDefinition,
    DataIvemIdExecuteScanRankedDataIvemIdListDefinition,
    RankedDataIvemIdListDefinition,
    ScanIdRankedDataIvemIdListDefinition,
    WatchmakerListIdRankedDataIvemIdListDefinition
} from "./definition/internal-api";
import { RankedDataIvemIdList } from './ranked-data-ivem-id-list';
import { ScanIdRankedDataIvemIdList } from './scan-id-ranked-data-ivem-id-list';
import { WatchmakerListIdRankedDataIvemIdList } from './watchmaker-list-id-ranked-data-ivem-id-list';

/** @public */
export class RankedDataIvemIdListFactoryService {
    constructor(
        private readonly _adiService: AdiService,
        private readonly _scansService: ScansService,
        private readonly _watchmakerService: WatchmakerService,
    ) {

    }
    // needs fixing
    createFromDefinition(definition: RankedDataIvemIdListDefinition): RankedDataIvemIdList {
        switch (definition.typeId) {
            case RankedDataIvemIdListDefinition.TypeId.DataIvemIdArray:
                return new DataIvemIdArrayRankedDataIvemIdList(
                    definition as DataIvemIdArrayRankedDataIvemIdListDefinition
                );
            case RankedDataIvemIdListDefinition.TypeId.WatchmakerListId:
                return new WatchmakerListIdRankedDataIvemIdList(
                    this._watchmakerService,
                    definition as WatchmakerListIdRankedDataIvemIdListDefinition
                );
            case RankedDataIvemIdListDefinition.TypeId.ScanId:
                return new ScanIdRankedDataIvemIdList(
                    this._adiService,
                    this._scansService,
                    definition as ScanIdRankedDataIvemIdListDefinition
                );
            case RankedDataIvemIdListDefinition.TypeId.DataIvemIdExecuteScan:
                return new DataIvemIdExecuteScanRankedDataIvemIdList(
                    this._adiService,
                    definition as DataIvemIdExecuteScanRankedDataIvemIdListDefinition
                );
            default:
                throw new UnreachableCaseError('RLILFSCFD15169', definition.typeId);
        }
    }
}
