import { JsonElement, Ok, PickEnum, Result } from '@pbkware/js-utils';
import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from 'revgrid';
import { DataIvemId, MarketIvemId, MarketsService, TopShareholder } from '../../../../adi';
import { ErrorCode } from '../../../../sys';
import { TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory, TopShareholderTableFieldSourceDefinition } from '../../field-source/internal-api';
import { TableRecordSourceDefinition } from './table-record-source-definition';

/** @public */
export class TopShareholderTableRecordSourceDefinition extends TableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        readonly dataIvemId: DataIvemId,
        readonly tradingDate: Date | undefined,
        readonly compareToTradingDate: Date | undefined,
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.TopShareholder,
            TopShareholderTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);

        const dataIvemIdElement = element.newElement(TopShareholderTableRecordSourceDefinition.JsonTag.dataIvemId);
        this.dataIvemId.saveToJson(dataIvemIdElement);
        if (this.tradingDate !== undefined) {
            element.setDate(TopShareholderTableRecordSourceDefinition.JsonTag.tradingDate, this.tradingDate);
        }
        if (this.compareToTradingDate !== undefined) {
            element.setDate(TopShareholderTableRecordSourceDefinition.JsonTag.compareToTradingDate, this.compareToTradingDate);
        }
    }

    override createDefaultLayoutDefinition() {
        const topShareholdersFieldSourceDefinition = TopShareholderTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        const fieldNames = new Array<string>();

        fieldNames.push(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.Name));
        fieldNames.push(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.SharesHeld));
        fieldNames.push(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.TotalShareIssue));
        fieldNames.push(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.Designation));
        fieldNames.push(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.HolderKey));
        fieldNames.push(topShareholdersFieldSourceDefinition.getSupportedFieldNameById(TopShareholder.FieldId.SharesChanged));

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }
}

/** @public */
export namespace TopShareholderTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.TopShareholder
    >;
    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.TopShareholder,
    ];
    export const defaultFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.TopShareholder,
    ];

    export namespace JsonTag {
        export const dataIvemId = 'dataIvemId';
        export const tradingDate = 'tradingDate';
        export const compareToTradingDate = 'compareToTradingDate';
    }

    export interface CreateParameters {
        readonly dataIvemId: DataIvemId;
        readonly tradingDate: Date | undefined;
        readonly compareToTradingDate: Date | undefined;
    }

    export function tryGetCreateParametersFromJson(marketsService: MarketsService, element: JsonElement): Result<CreateParameters> {
        const dataIvemIdResult = MarketIvemId.tryCreateFromJson(marketsService.dataMarkets, element, DataIvemId, false);
        if (dataIvemIdResult.isErr()) {
            return dataIvemIdResult.createOuter(ErrorCode.TopShareholderTableRecordSourceDefinition_DataIvemIdNotSpecified);
        } else {
            const tradingDateResult = element.tryGetDate(JsonTag.tradingDate);
            const tradingDate = tradingDateResult.isOk() ? tradingDateResult.value : undefined;

            const compareToTradingDateResult = element.tryGetDate(JsonTag.compareToTradingDate);
            const compareToTradingDate = compareToTradingDateResult.isOk() ? compareToTradingDateResult.value : undefined;

            const parameters: CreateParameters = {
                dataIvemId: dataIvemIdResult.value,
                tradingDate,
                compareToTradingDate,
            };

            return new Ok(parameters);
        }
    }
}
