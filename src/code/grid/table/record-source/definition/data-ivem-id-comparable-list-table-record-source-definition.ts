import { JsonElement, Ok, PickEnum, Result } from '@pbkware/js-utils';
import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from 'revgrid';
import { DataIvemId, MarketIvemId, MarketsService } from '../../../../adi';
import { ErrorCode, JsonElementErr, UiComparableList } from '../../../../sys';
import {
    DataIvemBaseDetailTableFieldSourceDefinition,
    DataIvemIdTableFieldSourceDefinition,
    SecurityDataItemTableFieldSourceDefinition,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactory
} from "../../field-source/internal-api";
import { BadnessListTableRecordSourceDefinition } from './badness-list-table-record-source-definition';
import { TableRecordSourceDefinition } from './table-record-source-definition';

/** @public */
export class DataIvemIdComparableListTableRecordSourceDefinition extends BadnessListTableRecordSourceDefinition<DataIvemId> {
    declare list: UiComparableList<DataIvemId>;

    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        list: UiComparableList<DataIvemId>,
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.DataIvemIdComparableList,
            DataIvemIdComparableListTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
            list,
        );
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        const listElementArray = MarketIvemId.createJsonElementArray(this.list.toArray());
        element.setElementArray(DataIvemIdComparableListTableRecordSourceDefinition.JsonName.list, listElementArray);
    }

    override createDefaultLayoutDefinition(): RevColumnLayoutDefinition {
        const dataIvemIdFieldSourceDefinition = DataIvemIdTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        const fieldNames = new Array<string>();

        fieldNames.push(dataIvemIdFieldSourceDefinition.getFieldNameById(MarketIvemId.FieldId.DataIvemId));

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }
}

/** @public */
export namespace DataIvemIdComparableListTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.DataIvemId |
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail |
        TableFieldSourceDefinition.TypeId.SecurityDataItem
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.DataIvemId,
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail,
        TableFieldSourceDefinition.TypeId.SecurityDataItem,
    ];

    export const defaultFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.DataIvemId,
    ];

    export type FieldId =
        DataIvemBaseDetailTableFieldSourceDefinition.FieldId |
        SecurityDataItemTableFieldSourceDefinition.FieldId |
        DataIvemIdTableFieldSourceDefinition.FieldId;

    export namespace JsonName {
        export const list = 'list';
    }

    export function tryCreateListFromElement(marketsService: MarketsService, element: JsonElement): Result<UiComparableList<DataIvemId>> {
        const elementArrayResult = element.tryGetElementArray(JsonName.list);
        if (elementArrayResult.isErr()) {
            const errorId = elementArrayResult.error;
            if (errorId === JsonElement.ErrorId.JsonValueIsNotAnArray) {
                return JsonElementErr.createOuter(elementArrayResult.error, ErrorCode.DataIvemIdComparableListTableRecordSourceDefinition_JsonDataIvemIdsNotSpecified);
            } else {
                return JsonElementErr.createOuter(elementArrayResult.error, ErrorCode.DataIvemIdComparableListTableRecordSourceDefinition_JsonDataIvemIdsIsInvalid);
            }
        } else {
            const dataIvemIdsResult = MarketIvemId.tryCreateArrayFromJsonElementArray(marketsService.dataMarkets, elementArrayResult.value, DataIvemId, false);
            if (dataIvemIdsResult.isErr()) {
                return dataIvemIdsResult.createOuter(ErrorCode.DataIvemIdComparableListTableRecordSourceDefinition_JsonDataIvemIdArrayIsInvalid);
            } else {
                const dataIvemIds = dataIvemIdsResult.value;
                const list = new UiComparableList<DataIvemId>();
                list.addRange(dataIvemIds);
                return new Ok(list);
            }
        }
    }

    export function tryCreateDefinition(
        marketsService: MarketsService,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        element: JsonElement,
    ): Result<DataIvemIdComparableListTableRecordSourceDefinition> {
        const listCreateResult = tryCreateListFromElement(marketsService, element);
        if (listCreateResult.isErr()) {
            const errorCode = ErrorCode.DataIvemIdComparableListTableRecordSourceDefinition_JsonListIsInvalid;
            return listCreateResult.createOuter(errorCode);
        } else {
            const list = listCreateResult.value;
            const definition = new DataIvemIdComparableListTableRecordSourceDefinition(customHeadings, tableFieldSourceDefinitionCachingFactory, list);
            return new Ok(definition);
        }
    }

    export function createLayoutDefinition(
        fieldSourceDefinitionRegistryService: TableFieldSourceDefinitionCachingFactory,
        fieldIds: FieldId[],
    ): RevColumnLayoutDefinition {
        return fieldSourceDefinitionRegistryService.createLayoutDefinition(fieldIds);
    }

    export function is(definition: TableRecordSourceDefinition): definition is DataIvemIdComparableListTableRecordSourceDefinition {
        return definition.typeId === TableRecordSourceDefinition.TypeId.DataIvemIdComparableList;
    }
}
