import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import {
    RankedDataIvemIdListDefinition,
    RankedDataIvemIdListDefinitionFactoryService
} from "../../../../ranked-lit-ivem-id-list/internal-api";
import { ErrorCode, JsonElement, JsonElementErr, PickEnum, Result } from '../../../../sys/internal-api';
import {
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactory
} from "../../field-source/internal-api";
import { TableRecordSourceDefinition } from './table-record-source-definition';

/** @public */
export abstract class RankedDataIvemIdListTableRecordSourceDefinition extends TableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        allowedFieldSourceDefinitionTypeIds: RankedDataIvemIdListTableRecordSourceDefinition.FieldSourceDefinitionTypeId[],
        readonly rankedDataIvemIdListDefinition: RankedDataIvemIdListDefinition
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.RankedDataIvemIdList,
            allowedFieldSourceDefinitionTypeIds,
        );
    }

    abstract get defaultFieldSourceDefinitionTypeIds(): RankedDataIvemIdListTableRecordSourceDefinition.FieldSourceDefinitionTypeId[];

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        const elementName = RankedDataIvemIdListTableRecordSourceDefinition.JsonName.definition;
        const dataIvemIdListElement = element.newElement(elementName);
        this.rankedDataIvemIdListDefinition.saveToJson(dataIvemIdListElement);
    }
}

/** @public */
export namespace RankedDataIvemIdListTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail |
        TableFieldSourceDefinition.TypeId.SecurityDataItem |
        TableFieldSourceDefinition.TypeId.RankedDataIvemId
    >;

    export namespace JsonName {
        export const definition = 'definition';
    }

    export function tryCreateDefinition(
        dataIvemIdListDefinitionFactoryService: RankedDataIvemIdListDefinitionFactoryService,
        element: JsonElement
    ): Result<RankedDataIvemIdListDefinition> {
        const definitionElementResult = element.tryGetElement(JsonName.definition);
        if (definitionElementResult.isErr()) {
            const errorCode = ErrorCode.RankedDataIvemIdListTableRecordSourceDefinition_DefinitionElementNotSpecified;
            return JsonElementErr.createOuter(definitionElementResult.error, errorCode);
        } else {
            const definitionElement = definitionElementResult.value;

            const definitionResult = dataIvemIdListDefinitionFactoryService.tryCreateFromJson(definitionElement);
            if (definitionResult.isErr()) {
                const errorCode = definitionResult.error as ErrorCode;
                if (errorCode === ErrorCode.DataIvemIdArrayRankedDataIvemIdListDefinition_JsonNotSpecified) {
                    return definitionResult.createOuter(ErrorCode.RankedDataIvemIdListTableRecordSourceDefinition_DefinitionJsonNotSpecified);
                } else {
                    return definitionResult.createOuter(ErrorCode.RankedDataIvemIdListTableRecordSourceDefinition_DefinitionJsonIsInvalid);
                }
            } else {
                return definitionResult;
            }
        }
    }
}
