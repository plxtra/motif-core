import { ChangeSubscribableComparableList, JsonElement, Ok, PickEnum, Result } from '@xilytix/sysutils';
import { DataIvemId, Market, MarketIvemId, MarketsService } from '../../../../adi/internal-api';
import { ErrorCode, JsonElementErr } from '../../../../sys/internal-api';
import { TableFieldSourceDefinition } from '../../field-source/internal-api';
import { UsableListTableRecordSourceDefinition } from './usable-list-table-record-source-definition';

/** @public */
export abstract class DataIvemIdUsableListTableRecordSourceDefinition extends UsableListTableRecordSourceDefinition<DataIvemId> {
    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        const listElementArray = MarketIvemId.createJsonElementArray(this.list.toArray());
        element.setElementArray(DataIvemIdUsableListTableRecordSourceDefinition.JsonName.list, listElementArray);
    }
}

/** @public */
export namespace DataIvemIdUsableListTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail |
        TableFieldSourceDefinition.TypeId.RankedDataIvemId |
        TableFieldSourceDefinition.TypeId.SecurityDataItem
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail,
        TableFieldSourceDefinition.TypeId.RankedDataIvemId,
        TableFieldSourceDefinition.TypeId.SecurityDataItem
    ];

    export namespace JsonName {
        export const list = 'list';
    }

    export function tryCreateListFromElement<T extends Market>(markets: MarketsService.Markets<T>, element: JsonElement, constructor: MarketIvemId.Constructor<T>): Result<ChangeSubscribableComparableList<MarketIvemId<T>>> {
        const elementArrayResult = element.tryGetElementArray(JsonName.list);
        if (elementArrayResult.isErr()) {
            const errorId = elementArrayResult.error;
            if (errorId === JsonElement.ErrorId.JsonValueIsNotDefined) {
                return JsonElementErr.createOuter(elementArrayResult.error, ErrorCode.DataIvemIdListTableRecordSourceDefinition_JsonDataIvemIdsNotSpecified);
            } else {
                return JsonElementErr.createOuter(elementArrayResult.error, ErrorCode.DataIvemIdListTableRecordSourceDefinition_JsonDataIvemIdsIsInvalid);
            }
        } else {
            const marketIvemIdsResult = MarketIvemId.tryCreateArrayFromJsonElementArray(markets, elementArrayResult.value, constructor, false);
            if (marketIvemIdsResult.isErr()) {
                return marketIvemIdsResult.createOuter(ErrorCode.DataIvemIdListTableRecordSourceDefinition_JsonDataIvemIdArrayIsInvalid);
            } else {
                const marketIvemIds = marketIvemIdsResult.value;
                const list = new ChangeSubscribableComparableList<MarketIvemId<T>>();
                list.addRange(marketIvemIds);
                return new Ok(list);
            }
        }
    }
}
