import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { DataIvemAlternateCodes, DataIvemBaseDetail, Exchange, MarketsService, MyxDataIvemAttributes, SearchSymbolsDataDefinition, SearchSymbolsDataIvemFullDetail, ZenithProtocolCommon } from '../../../../adi/internal-api';
import { ErrorCode, JsonElement, JsonElementErr, Ok, PickEnum, Result } from '../../../../sys/internal-api';
import {
    DataIvemAlternateCodesTableFieldSourceDefinition,
    DataIvemBaseDetailTableFieldSourceDefinition,
    DataIvemExtendedDetailTableFieldSourceDefinition,
    MyxDataIvemAttributesTableFieldSourceDefinition,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactory
} from '../../field-source/internal-api';
import { TableRecordSourceDefinition } from './table-record-source-definition';

export class DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition extends TableRecordSourceDefinition {
    readonly exchange: Exchange | undefined;
    readonly isFullDetail: boolean;

    constructor(
        private readonly _marketsService: MarketsService,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        readonly dataDefinition: SearchSymbolsDataDefinition
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.DataIvemDetailsFromSearchSymbols,
            DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );

        this.exchange = this.calculateExchange(dataDefinition);
        this.isFullDetail = dataDefinition.fullSymbol;
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        const requestElement = element.newElement(DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition.JsonName.request);
        this.dataDefinition.saveToJson(requestElement);
    }

    override createDefaultLayoutDefinition() {
        const fieldNames = new Array<string>();

        this.addDataIvemBaseDetailToDefaultColumnLayout(fieldNames);

        if (this.dataDefinition.fullSymbol) {
            this.addDataIvemExtendedDetailFieldDefinitionSource(fieldNames);
            if (this.exchange !== undefined && this.exchange.unenvironmentedZenithCode === ZenithProtocolCommon.KnownExchange.Myx as string) {
                this.addMyxDataIvemAttributesFieldDefinitionSource(fieldNames);
            }
            this.addDataIvemAlternateCodesFieldDefinitionSource(fieldNames);
        }

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }

    getDefaultFieldSourceDefinitionTypeIds(): DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition.FieldSourceDefinitionTypeId[] {
        const result: DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition.FieldSourceDefinitionTypeId[] =
            [TableFieldSourceDefinition.TypeId.DataIvemBaseDetail];

        if (this.dataDefinition.fullSymbol) {
            result.push(TableFieldSourceDefinition.TypeId.DataIvemExtendedDetail);
            if (this.exchange !== undefined && this.exchange.unenvironmentedZenithCode === ZenithProtocolCommon.KnownExchange.Myx as string) {
                result.push(TableFieldSourceDefinition.TypeId.MyxDataIvemAttributes);
            }
            result.push(TableFieldSourceDefinition.TypeId.DataIvemAlternateCodes);
        }
        return result;
    }

    private calculateExchange(dataDefinition: SearchSymbolsDataDefinition) {
        return DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition.calculateExchange(this._marketsService, dataDefinition);
    }

    private addDataIvemBaseDetailToDefaultColumnLayout(fieldNames: string[]) {
        const fieldSourceDefinition = DataIvemBaseDetailTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemBaseDetail.Field.Id.Id));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemBaseDetail.Field.Id.Name));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemBaseDetail.Field.Id.Code));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemBaseDetail.Field.Id.Market));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemBaseDetail.Field.Id.Exchange));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemBaseDetail.Field.Id.TradingMarkets));
    }

    private addDataIvemExtendedDetailFieldDefinitionSource(fieldNames: string[]) {
        const fieldSourceDefinition = DataIvemExtendedDetailTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.IsIndex));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.Categories));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.CallOrPutId));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ExerciseTypeId));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.StrikePrice));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ExpiryDate));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(SearchSymbolsDataIvemFullDetail.ExtendedField.Id.ContractSize));
        // columnLayout.addColumn(fieldSourceDefinition.getSupportedFieldNameById(DataIvemFullDetail.ExtendedField.Id.DepthDirection
    }

    private addMyxDataIvemAttributesFieldDefinitionSource(fieldNames: string[]) {
        const fieldSourceDefinition = MyxDataIvemAttributesTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(MyxDataIvemAttributes.Field.Id.MarketClassification));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(MyxDataIvemAttributes.Field.Id.Category));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(MyxDataIvemAttributes.Field.Id.Sector));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(MyxDataIvemAttributes.Field.Id.SubSector));
    }

    private addDataIvemAlternateCodesFieldDefinitionSource(fieldNames: string[]) {
        const fieldSourceDefinition = DataIvemAlternateCodesTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemAlternateCodes.Field.Id.Ticker));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemAlternateCodes.Field.Id.Isin));
        fieldNames.push(fieldSourceDefinition.getSupportedFieldNameById(DataIvemAlternateCodes.Field.Id.Gics));
    }
}

export namespace DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail |
        TableFieldSourceDefinition.TypeId.DataIvemExtendedDetail |
        TableFieldSourceDefinition.TypeId.DataIvemAlternateCodes |
        TableFieldSourceDefinition.TypeId.MyxDataIvemAttributes
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail,
        TableFieldSourceDefinition.TypeId.DataIvemExtendedDetail,
        TableFieldSourceDefinition.TypeId.DataIvemAlternateCodes,
        TableFieldSourceDefinition.TypeId.MyxDataIvemAttributes,
    ];

    export type FieldId =
        DataIvemBaseDetailTableFieldSourceDefinition.FieldId |
        DataIvemExtendedDetailTableFieldSourceDefinition.FieldId |
        DataIvemAlternateCodesTableFieldSourceDefinition.FieldId |
        MyxDataIvemAttributesTableFieldSourceDefinition.FieldId;

    export namespace JsonName {
        export const request = 'request';
    }

    export function tryCreateDataDefinitionFromJson(element: JsonElement | undefined): Result<SearchSymbolsDataDefinition> {
        if (element === undefined) {
            const definition = createDefaultDataDefinition();
            return new Ok(definition);
        } else {
            const requestElementResult = element.tryGetElement(DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition.JsonName.request);
            if (requestElementResult.isErr()) {
                return JsonElementErr.createOuter(requestElementResult.error, ErrorCode.DataIvemDetailsFromSearchSymbolsTableRecordSourceDefinition_RequestNotSpecified);
            } else {
                return SearchSymbolsDataDefinition.tryCreateFromJson(requestElementResult.value);
            }
        }
    }

    export function createDefaultDataDefinition() {
        return new SearchSymbolsDataDefinition();
    }

    export function createLayoutDefinition(
        fieldSourceDefinitionRegistryService: TableFieldSourceDefinitionCachingFactory,
        fieldIds: FieldId[],
    ): RevColumnLayoutDefinition {
        return fieldSourceDefinitionRegistryService.createLayoutDefinition(fieldIds);
    }

    export function is(definition: TableRecordSourceDefinition): definition is DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition {
        return definition.typeId === TableRecordSourceDefinition.TypeId.DataIvemDetailsFromSearchSymbols;
    }

    export function calculateExchange(marketsService: MarketsService, dataDefinition: SearchSymbolsDataDefinition) {
        // Returns an exchange if all markets have same exchange and that is the same as exchange specified in DataDefinition.
        // If any are different, returns undefined.
        // If none are specified, returns undefined.
        let marketsExchange: Exchange | undefined;
        const marketZenithCodes = dataDefinition.marketZenithCodes;
        let atLeastOneMarketSpecified: boolean;
        if (marketZenithCodes === undefined) {
            atLeastOneMarketSpecified = false;
            marketsExchange = undefined;
        } else {
            const marketZenithCodeCount = marketZenithCodes.length;
            if (marketZenithCodeCount === 0) {
                atLeastOneMarketSpecified = false;
                marketsExchange = undefined;
            } else {
                atLeastOneMarketSpecified = true;
                const firstMarket = marketsService.dataMarkets.findZenithCode(marketZenithCodes[0]);
                if (firstMarket === undefined) {
                    marketsExchange = undefined;
                } else {
                    marketsExchange = firstMarket.exchange;
                    // make sure they are all the same
                    for (let i = 1; i < marketZenithCodeCount; i++) {
                        const market = marketsService.dataMarkets.findZenithCode(marketZenithCodes[i]);
                        if (market === undefined || market.exchange !== marketsExchange) {
                            marketsExchange = undefined;
                            break;
                        }
                    }
                }
            }
        }

        if (atLeastOneMarketSpecified && marketsExchange === undefined) {
            return undefined; // markets specified different exchanges
        } else {
            const dataDefinitionExchangeZenithCode = dataDefinition.exchangeZenithCode;
            const dataDefinitionExchangeZenithCodeDefined = dataDefinitionExchangeZenithCode !== undefined;

            let exchange: Exchange | undefined;
            if (atLeastOneMarketSpecified) {
                if (!dataDefinitionExchangeZenithCodeDefined) {
                    exchange = marketsExchange;
                } else {
                    const dataDefinitionExchange = marketsService.exchanges.findZenithCode(dataDefinitionExchangeZenithCode);
                    if (marketsExchange === undefined || marketsExchange === dataDefinitionExchange) {
                        exchange = dataDefinitionExchange;
                    } else {
                        exchange = undefined;
                    }
                }
            } else {
                if (dataDefinitionExchangeZenithCodeDefined) {
                    exchange = marketsService.exchanges.findZenithCode(dataDefinitionExchangeZenithCode);
                } else {
                    exchange = undefined;
                }
            }
            return exchange;
        }
    }
}
