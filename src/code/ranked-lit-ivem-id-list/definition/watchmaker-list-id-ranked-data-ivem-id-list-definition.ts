import { JsonElement, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, JsonElementErr } from '../../sys';
import { RankedDataIvemIdListDefinition } from './ranked-data-ivem-id-list-definition';

/** @public */
export class WatchmakerListIdRankedDataIvemIdListDefinition extends RankedDataIvemIdListDefinition {
    constructor(readonly watchmakerListId: string) {
        super(RankedDataIvemIdListDefinition.TypeId.WatchmakerListId);
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        element.setString(WatchmakerListIdRankedDataIvemIdListDefinition.JsonName.watchmakerListId, this.watchmakerListId);
    }
}

/** @public */
export namespace  WatchmakerListIdRankedDataIvemIdListDefinition {
    export namespace JsonName {
        export const watchmakerListId = 'watchmakerListId';
    }

    export function tryCreateFromJson(element: JsonElement): Result<WatchmakerListIdRankedDataIvemIdListDefinition> {
        const watchlistIdResult = element.tryGetString(JsonName.watchmakerListId);
        if (watchlistIdResult.isErr()) {
            return JsonElementErr.createOuter(watchlistIdResult.error, ErrorCode.WatchmakerListIdRankedDataIvemIdListDefinition_WatchmakerListIdIsInvalid);
        } else {
            const definition = new WatchmakerListIdRankedDataIvemIdListDefinition(watchlistIdResult.value);
            return new Ok(definition);
        }
    }
}
