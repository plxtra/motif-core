import { Err, Integer, JsonElement, Result } from '@pbkware/js-utils';
import { MarketsService } from '../../adi';
import { ErrorCode } from '../../sys';
import { DataIvemIdArrayRankedDataIvemIdListDefinition } from './data-ivem-id-array-ranked-data-ivem-id-list-definition';
import { DataIvemIdExecuteScanRankedDataIvemIdListDefinition } from './data-ivem-id-execute-scan-ranked-data-ivem-id-list-definition';
import { RankedDataIvemIdListDefinition } from './ranked-data-ivem-id-list-definition';
import { ScanIdRankedDataIvemIdListDefinition } from './scan-id-ranked-data-ivem-id-list-definition';
import { WatchmakerListIdRankedDataIvemIdListDefinition } from './watchmaker-list-id-ranked-data-ivem-id-list-definition';

/** @public */
export class RankedDataIvemIdListDefinitionFactoryService {
    constructor(private readonly _marketsService: MarketsService) {

    }

    tryCreateFromJson(element: JsonElement): Result<RankedDataIvemIdListDefinition> {
        const typeIdJsonValueResult = RankedDataIvemIdListDefinition.tryGetTypeIdFromJson(element);
        if (typeIdJsonValueResult.isErr()) {
            return typeIdJsonValueResult.createOuter(ErrorCode.DataIvemIdListDefinitionFactoryService_GetTypeId);
        } else {
            const typeIdJsonValue = typeIdJsonValueResult.value;
            return this.tryCreateFromTypedJson(element, typeIdJsonValue);
        }
    }

    private tryCreateFromTypedJson(element: JsonElement, typeId: RankedDataIvemIdListDefinition.TypeId): Result<RankedDataIvemIdListDefinition> {
        switch (typeId) {
            case RankedDataIvemIdListDefinition.TypeId.DataIvemIdArray: return DataIvemIdArrayRankedDataIvemIdListDefinition.tryCreateFromJson(this._marketsService.dataMarkets, element);
            case RankedDataIvemIdListDefinition.TypeId.WatchmakerListId: return WatchmakerListIdRankedDataIvemIdListDefinition.tryCreateFromJson(element);
            case RankedDataIvemIdListDefinition.TypeId.ScanId: return ScanIdRankedDataIvemIdListDefinition.tryCreateFromJson(element);
            case RankedDataIvemIdListDefinition.TypeId.DataIvemIdExecuteScan: return DataIvemIdExecuteScanRankedDataIvemIdListDefinition.tryCreateFromJson(element);
            default: {
                const neverTypeId: never = typeId;
                return new Err(`${ErrorCode.DataIvemIdListDefinitionFactoryService_UnsupportedTypeId} (${neverTypeId as Integer})`);
            }
        }
    }
}
