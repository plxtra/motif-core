import { Guid, JsonElement, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, JsonElementErr } from '../../sys';
import { RankedDataIvemIdListDefinition } from './ranked-data-ivem-id-list-definition';

/** @public */
export class ScanIdRankedDataIvemIdListDefinition extends RankedDataIvemIdListDefinition {
    constructor(readonly scanId: Guid,) {
        super(RankedDataIvemIdListDefinition.TypeId.ScanId);
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        element.setString(ScanIdRankedDataIvemIdListDefinition.JsonName.scanId, this.scanId);
    }
}

/** @public */
export namespace ScanIdRankedDataIvemIdListDefinition {
    export namespace JsonName {
        export const scanId = 'scanId';
    }

    export function tryCreateFromJson(element: JsonElement): Result<ScanIdRankedDataIvemIdListDefinition> {
        const scanIdResult = element.tryGetString(JsonName.scanId);
        if (scanIdResult.isErr()) {
            return JsonElementErr.createOuter(scanIdResult.error, ErrorCode.ScanIdRankedDataIvemIdListDefinition_ScanIdIsInvalid);
        } else {
            const definition = new ScanIdRankedDataIvemIdListDefinition(scanIdResult.value);
            return new Ok(definition);
        }
    }
}
