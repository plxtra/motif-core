import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { JsonElement, Ok, PickEnum, Result } from '@xilytix/sysutils';
import { IvemId, MarketsService, SecurityDataItem } from '../../../../adi/internal-api';
import { CallPut } from '../../../../services/internal-api';
import { ErrorCode, JsonElementErr } from '../../../../sys/internal-api';
import {
    CallPutTableFieldSourceDefinition,
    CallSecurityDataItemTableFieldSourceDefinition,
    PutSecurityDataItemTableFieldSourceDefinition,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactory
} from '../../field-source/internal-api';
import { TableRecordSourceDefinition } from './table-record-source-definition';

/** @public */
export class CallPutFromUnderlyingTableRecordSourceDefinition extends TableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        readonly underlyingIvemId: IvemId
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.CallPutFromUnderlying,
            CallPutFromUnderlyingTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        const underlyingIvemIdElement = element.newElement(CallPutFromUnderlyingTableRecordSourceDefinition.JsonTag.underlyingIvemId);
        this.underlyingIvemId.saveToJson(underlyingIvemIdElement);
    }

    override createDefaultLayoutDefinition() {
        const callPutFieldSourceDefinition = CallPutTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);
        const callSecurityDataItemFieldSourceDefinition = CallSecurityDataItemTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);
        const putSecurityDataItemFieldSourceDefinition = PutSecurityDataItemTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        const fieldNames = new Array<string>();

        fieldNames.push(callSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.BestBid));
        fieldNames.push(callSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.BestAsk));
        fieldNames.push(callSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Last));
        fieldNames.push(callSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Open));
        fieldNames.push(callSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.High));
        fieldNames.push(callSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Low));
        fieldNames.push(callSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Close));
        fieldNames.push(callSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Volume));

        fieldNames.push(callPutFieldSourceDefinition.getSupportedFieldNameById(CallPut.FieldId.ExercisePrice));
        fieldNames.push(callPutFieldSourceDefinition.getSupportedFieldNameById(CallPut.FieldId.ExpiryDate));
        fieldNames.push(callPutFieldSourceDefinition.getSupportedFieldNameById(CallPut.FieldId.Market));
        fieldNames.push(callPutFieldSourceDefinition.getSupportedFieldNameById(CallPut.FieldId.CallDataIvemId));
        fieldNames.push(callPutFieldSourceDefinition.getSupportedFieldNameById(CallPut.FieldId.PutDataIvemId));

        fieldNames.push(putSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.BestBid));
        fieldNames.push(putSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.BestAsk));
        fieldNames.push(putSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Last));
        fieldNames.push(putSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Open));
        fieldNames.push(putSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.High));
        fieldNames.push(putSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Low));
        fieldNames.push(putSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Close));
        fieldNames.push(putSecurityDataItemFieldSourceDefinition.getSupportedFieldNameById(SecurityDataItem.FieldId.Volume));

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }

}

/** @public */
export namespace CallPutFromUnderlyingTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.CallPut |
        TableFieldSourceDefinition.TypeId.CallSecurityDataItem |
        TableFieldSourceDefinition.TypeId.PutSecurityDataItem
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.CallPut,
        TableFieldSourceDefinition.TypeId.CallSecurityDataItem,
        TableFieldSourceDefinition.TypeId.PutSecurityDataItem,
    ];

    export const defaultFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.CallPut,
        TableFieldSourceDefinition.TypeId.CallSecurityDataItem,
        TableFieldSourceDefinition.TypeId.PutSecurityDataItem,
    ];

    export namespace JsonTag {
        export const underlyingIvemId = 'underlyingIvemId';
    }

    export function tryGetUnderlyingIvemIdFromJson(marketsService: MarketsService, element: JsonElement): Result<IvemId> {
        const underlyingIvemIdElementResult = element.tryGetElement(JsonTag.underlyingIvemId);
        if (underlyingIvemIdElementResult.isErr()) {
            return JsonElementErr.createOuter(underlyingIvemIdElementResult.error, ErrorCode.CallPutFromUnderlyingTableRecordSourceDefinition_UnderlyingIvemIdNotSpecified);
        } else {
            const underlyingIvemIdResult = IvemId.tryCreateFromJson(marketsService, underlyingIvemIdElementResult.value, false);
            if (underlyingIvemIdResult.isErr()) {
                return underlyingIvemIdResult.createOuter(ErrorCode.TableRecordSourceDefinitionFactoryService_CallPutFromUnderlying_UnderlyingIvemIdIsInvalid);
            } else {
                return new Ok(underlyingIvemIdResult.value);
            }
        }
    }
}
