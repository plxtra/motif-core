import { DataIvemIdExecuteScanDataDefinition } from '../../adi/internal-api';
import { Err, ErrorCode, JsonElement, Result } from '../../sys/internal-api';
import { RankedDataIvemIdListDefinition } from './ranked-data-ivem-id-list-definition';

/** @public */
export class DataIvemIdExecuteScanRankedDataIvemIdListDefinition extends RankedDataIvemIdListDefinition {
    constructor(
        readonly name: string,
        readonly description: string,
        readonly category: string,
        readonly dataIvemIdExecuteScanDataDefinition: DataIvemIdExecuteScanDataDefinition
    ) {
        super(RankedDataIvemIdListDefinition.TypeId.DataIvemIdExecuteScan);
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        // not supported so do not save anything else
    }
}

/** @public */
export namespace DataIvemIdExecuteScanRankedDataIvemIdListDefinition {
    export function tryCreateFromJson(element: JsonElement): Result<DataIvemIdExecuteScanRankedDataIvemIdListDefinition> {
        return new Err(ErrorCode.DataIvemIdExecuteScanRankedDataIvemIdListDefinition_JsonNotSupported);
    }
}
