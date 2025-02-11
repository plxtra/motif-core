import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import {
    AssertInternalError,
    Integer,
    LockOpenListItem,
    MultiEvent,
    UnreachableCaseError,
    UsableListChangeTypeId
} from '@xilytix/sysutils';
import {
    AdiService,
    Exchange,
    MarketsService,
    SearchSymbolsDataDefinition,
    SymbolsDataItem,
    ZenithProtocolCommon
} from "../../../adi/internal-api";
import { TextFormatter } from '../../../services/internal-api';
import {
    Badness,
    CorrectnessBadness,
} from '../../../sys/internal-api';
import {
    TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory
} from "../field-source/internal-api";
import { DataIvemBaseDetailTableRecordDefinition } from '../record-definition/internal-api';
import { TableRecord } from '../record/internal-api';
import {
    DataIvemAlternateCodesTableValueSource,
    DataIvemBaseDetailTableValueSource,
    DataIvemExtendedDetailTableValueSource,
    MyxDataIvemAttributesTableValueSource
} from "../value-source/internal-api";
import {
    DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition
} from './definition/internal-api';
import { SingleDataItemTableRecordSource } from './single-data-item-table-record-source';

export class DataIvemDetailFromSearchSymbolsTableRecordSource extends SingleDataItemTableRecordSource {
    declare readonly _definition: DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition;
    readonly recordList: SymbolsDataItem.Record[] = [];

    private readonly _dataDefinition: SearchSymbolsDataDefinition;
    private readonly _exchange: Exchange | undefined;
    private readonly _isFullDetail: boolean;

    private _dataItem: SymbolsDataItem;
    private _dataItemSubscribed = false;
    private _dataIvemDetails: SymbolsDataItem.Record[];
    private _listChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _badnessChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    // setting accountId to undefined will return orders for all accounts
    constructor(
        private readonly _marketsService: MarketsService,
        private readonly _adiService: AdiService,
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
            definition.allowedFieldSourceDefinitionTypeIds,
        );
        this._dataDefinition = this._definition.dataDefinition;
        this._exchange = this._definition.exchange;
        this._isFullDetail = this._definition.isFullDetail;
    }

    get dataDefinition() { return this._dataDefinition; }

    override createDefinition(): DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition {
        return new DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition(
            this._marketsService,
            this.customHeadings,
            this.tableFieldSourceDefinitionCachingFactory,
            this._dataDefinition.createCopy(),
        );
    }

    override createRecordDefinition(idx: Integer): DataIvemBaseDetailTableRecordDefinition {
        const dataIvemBaseDetail = this.recordList[idx];
        return {
            typeId: TableFieldSourceDefinition.TypeId.DataIvemBaseDetail,
            mapKey: dataIvemBaseDetail.key.mapKey,
            dataIvemBaseDetail,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const dataIvemDetail = this.recordList[recordIndex];

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId =
                fieldSourceDefinition.typeId as DataIvemDetailFromSearchSymbolsTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            switch (fieldSourceDefinitionTypeId) {
                case TableFieldSourceDefinition.TypeId.DataIvemBaseDetail: {
                    const valueSource = new DataIvemBaseDetailTableValueSource(
                        result.fieldCount,
                        dataIvemDetail,
                        this._dataItem
                    );
                    result.addSource(valueSource);
                    break;
                }
                case TableFieldSourceDefinition.TypeId.DataIvemAlternateCodes: {
                    if (this._isFullDetail) {
                        const altCodesSource = new DataIvemAlternateCodesTableValueSource(
                            result.fieldCount,
                            dataIvemDetail,
                            this._dataItem
                        );
                        result.addSource(altCodesSource);
                    }
                    break;
                }
                case TableFieldSourceDefinition.TypeId.DataIvemExtendedDetail: {
                    if (this._isFullDetail) {
                        const dataIvemFullDetail = dataIvemDetail;
                        const valueSource = new DataIvemExtendedDetailTableValueSource(
                            result.fieldCount,
                            dataIvemFullDetail,
                            this._dataItem
                        );
                        result.addSource(valueSource);
                    }
                    break;
                }
                case TableFieldSourceDefinition.TypeId.MyxDataIvemAttributes: {
                    if (this._isFullDetail) {
                        const dataIvemFullDetail = dataIvemDetail;
                        if (this._exchange !== undefined && this._exchange.unenvironmentedZenithCode === ZenithProtocolCommon.KnownExchange.Myx as string) {
                            const attributesSource = new MyxDataIvemAttributesTableValueSource(
                                result.fieldCount,
                                dataIvemFullDetail,
                                this._dataItem
                            );
                            result.addSource(attributesSource);
                            break;
                        }
                    }
                    break;
                }
                default:
                    throw new UnreachableCaseError('SDITRSCTVL15599', fieldSourceDefinitionTypeId);
            }
        }

        return result;
    }

    override openLocked(opener: LockOpenListItem.Opener) {
        const definition = this._dataDefinition.createCopy();
        this._dataItem = this._adiService.subscribe(
            definition
        ) as SymbolsDataItem;
        this._dataItemSubscribed = true;
        super.setSingleDataItem(this._dataItem);
        this._dataIvemDetails = this._dataItem.records;
        this._listChangeEventSubscriptionId =
            this._dataItem.subscribeListChangeEvent(
                (listChangeTypeId, idx, count) => {
                    this.handleDataItemListChangeEvent(
                        listChangeTypeId,
                        idx,
                        count
                    );
                }
            );
        this._badnessChangedEventSubscriptionId =
            this._dataItem.subscribeBadnessChangedEvent(
                () => { this.handleDataItembadnessChangedEvent(); }
            );

        super.openLocked(opener);

        if (this._dataItem.usable) {
            const newCount = this._dataIvemDetails.length;
            if (newCount > 0) {
                this.processDataItemListChange(
                    UsableListChangeTypeId.PreUsableAdd,
                    0,
                    newCount
                );
            }
            this.processDataItemListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.processDataItemListChange(
                UsableListChangeTypeId.Unusable,
                0,
                0
            );
        }
    }

    override closeLocked(opener: LockOpenListItem.Opener) {
        // TableRecordDefinitionList can no longer be used after it is deactivated
        if (this.count > 0) {
            this.notifyListChange(UsableListChangeTypeId.Clear, 0, 0);
        }

        if (!this._dataItemSubscribed) {
            throw new AssertInternalError("BATRDLD4332", "");
        } else {
            this._dataItem.unsubscribeListChangeEvent(
                this._listChangeEventSubscriptionId
            );
            this._listChangeEventSubscriptionId = undefined;
            this._dataItem.unsubscribeBadnessChangedEvent(
                this._badnessChangedEventSubscriptionId
            );
            this._badnessChangedEventSubscriptionId = undefined;

            super.closeLocked(opener);

            this._adiService.unsubscribe(this._dataItem);
            this._dataItemSubscribed = false;
        }
    }

    protected getCount() {
        return this.recordList.length;
    }
    protected getCapacity() {
        return this.recordList.length;
    }
    protected setCapacity(value: Integer) {
        /* no code */
    }

    protected override processUsableChanged() {
        if (this.usable) {
            this.notifyListChange(UsableListChangeTypeId.PreUsableClear, 0, 0);
            const count = this.count;
            if (count > 0) {
                this.notifyListChange(
                    UsableListChangeTypeId.PreUsableAdd,
                    0,
                    count
                );
            }
            this.notifyListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.notifyListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return this._definition.getDefaultFieldSourceDefinitionTypeIds();
    }

    private handleDataItemListChangeEvent(
        listChangeTypeId: UsableListChangeTypeId,
        idx: Integer,
        count: Integer
    ) {
        this.processDataItemListChange(listChangeTypeId, idx, count);
    }

    private handleDataItembadnessChangedEvent() {
        this.checkSetUnusable(this._dataItem.badness);
    }

    private insertRecordDefinition(idx: Integer, count: Integer) {
        if (count === 1) {
            const record = this._dataIvemDetails[idx];
            if (idx === this.recordList.length) {
                this.recordList.push(record);
            } else {
                this.recordList.splice(idx, 0, record);
            }
        } else {
            const records = new Array<SymbolsDataItem.Record>(count);
            let insertArrayIdx = 0;
            for (let i = idx; i < idx + count; i++) {
                const record = this._dataIvemDetails[i];
                records[insertArrayIdx++] = record;
            }
            this.recordList.splice(idx, 0, ...records);
        }
    }

    private processDataItemListChange(
        listChangeTypeId: UsableListChangeTypeId,
        idx: Integer,
        count: Integer
    ) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                this.setUnusable(this._dataItem.badness);
                break;
            case UsableListChangeTypeId.PreUsableClear:
                this.setUnusable(Badness.preUsableClear);
                this.recordList.length = 0;
                break;
            case UsableListChangeTypeId.PreUsableAdd:
                this.setUnusable(Badness.preUsableAdd);
                this.insertRecordDefinition(idx, count);
                break;
            case UsableListChangeTypeId.Usable:
                this.setUsable(this._dataItem.badness);
                break;
            case UsableListChangeTypeId.Insert:
                this.insertRecordDefinition(idx, count);
                this.checkUsableNotifyListChange(
                    UsableListChangeTypeId.Insert,
                    idx,
                    count
                );
                break;
            case UsableListChangeTypeId.BeforeReplace:
                throw new AssertInternalError("SDITRSPDILCBR19662");
            case UsableListChangeTypeId.AfterReplace:
                throw new AssertInternalError("SDITRSPDILCAR19662");
            case UsableListChangeTypeId.BeforeMove:
                throw new AssertInternalError("SDITRSPDILCBM19662");
            case UsableListChangeTypeId.AfterMove:
                throw new AssertInternalError("SDITRSPDILCAM19662");
            case UsableListChangeTypeId.Remove:
                this.checkUsableNotifyListChange(
                    UsableListChangeTypeId.Remove,
                    idx,
                    count
                );
                this.recordList.splice(idx, count);
                break;
            case UsableListChangeTypeId.Clear:
                this.notifyListChange(UsableListChangeTypeId.Clear, idx, count);
                this.recordList.length = 0;
                break;
            default:
                throw new UnreachableCaseError(
                    "SDITRDLPDILC83372992",
                    listChangeTypeId
                );
        }
    }
}

export namespace DataIvemDetailFromSearchSymbolsTableRecordSource {
    // export interface Request {
    //     typeId: Request.TypeId;
    // }

    // export namespace Request {
    //     export const enum TypeId {
    //         Query,
    //         Subscription,
    //     }

    //     export function createCopy(request: Request) {
    //         switch (request.typeId) {
    //             case TypeId.Query: return QueryRequest.createCopy(request as QueryRequest);
    //             case TypeId.Subscription: return SubscriptionRequest.createCopy(request as SubscriptionRequest);
    //             default:
    //                 throw new UnreachableCaseError('SDITRDLRCC59938812', request.typeId);
    //         }
    //     }

    //     export function saveToJson(request: Request, element: JsonElement) {
    //         // throw new NotImplementedError('STRDLRSTJ3233992888');
    //     }
    // }

    // export interface QueryRequest extends Request {
    //     typeId: Request.TypeId.Query;

    //     searchText: string;
    //     showFull: boolean;

    //     exchangeId: ExchangeId | undefined;
    //     marketIds: readonly MarketId[] | undefined;
    //     cfi: string | undefined;
    //     fieldIds: readonly SymbolFieldId[] | undefined;
    //     isPartial: boolean | undefined;
    //     isCaseSensitive: boolean | undefined;
    //     preferExact: boolean | undefined;
    //     startIndex: Integer | undefined;
    //     count: Integer | undefined;
    // }

    // export namespace QueryRequest {
    //     export function createCopy(request: QueryRequest) {
    //         const result: QueryRequest = {
    //             typeId: Request.TypeId.Query,
    //             searchText: request.searchText,
    //             showFull: request.showFull,
    //             exchangeId: request.exchangeId,
    //             marketIds: request.marketIds,
    //             cfi: request.cfi,
    //             fieldIds: request.fieldIds,
    //             isPartial: request.isPartial,
    //             isCaseSensitive: request.isCaseSensitive,
    //             preferExact: request.preferExact,
    //             startIndex: request.startIndex,
    //             count: request.count,
    //         };

    //         return result;
    //     }
    // }

    // export interface SubscriptionRequest extends Request {
    //     typeId: Request.TypeId.Subscription;

    //     marketId: MarketId;
    //     classId: IvemClassId;
    // }

    // export namespace SubscriptionRequest {
    //     export function createCopy(request: SubscriptionRequest) {
    //         const result: SubscriptionRequest = {
    //             typeId: Request.TypeId.Subscription,
    //             marketId: request.marketId,
    //             classId: request.classId,
    //         };

    //         return result;
    //     }
    // }
}
