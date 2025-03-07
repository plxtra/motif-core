import {
    AssertInternalError,
    DecimalFactory,
    Integer,
    LockOpenListItem,
    MultiEvent,
    SourceTzOffsetDate,
    UnreachableCaseError,
    UsableListChangeTypeId,
} from '@pbkware/js-utils';
import { Decimal } from 'decimal.js-light';
import { RevSourcedFieldCustomHeadings } from 'revgrid';
import {
    AdiService,
    CallOrPutId,
    DataIvemId,
    DataMarket,
    IvemId,
    SearchSymbolsDataDefinition,
    SearchSymbolsDataIvemFullDetail,
    SymbolFieldId,
    SymbolsDataItem
} from '../../../adi/internal-api';
import { CallPut, TextFormatter } from '../../../services/internal-api';
import {
    Badness,
    CorrectnessBadness,
    ErrorCodeLogger,
} from '../../../sys/internal-api';
import {
    TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory
} from "../field-source/internal-api";
import { CallPutTableRecordDefinition } from '../record-definition/internal-api';
import { TableRecord } from '../record/internal-api';
import { CallPutTableValueSource, SecurityDataItemTableValueSource } from '../value-source/internal-api';
import { CallPutFromUnderlyingTableRecordSourceDefinition } from './definition/call-put-from-underlying-table-record-source-definition';
import { SingleDataItemTableRecordSource } from './single-data-item-table-record-source';

/** @public */
export class CallPutFromUnderlyingTableRecordSource extends SingleDataItemTableRecordSource {

    private readonly _underlyingIvemId: IvemId;

    private _recordList: CallPut[] = [];

    private _dataItem: SymbolsDataItem;
    private _dataItemSubscribed = false;
    // private _dataIvemDetails: DataIvemDetail[];
    private _dataItemListChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _dataItemBadnessChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        private readonly _adiService: AdiService,
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: CallPutFromUnderlyingTableRecordSourceDefinition,
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
            CallPutFromUnderlyingTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );
        this._underlyingIvemId = definition.underlyingIvemId;
    }

    override createDefinition(): CallPutFromUnderlyingTableRecordSourceDefinition {
        return new CallPutFromUnderlyingTableRecordSourceDefinition(
            this.customHeadings,
            this.tableFieldSourceDefinitionCachingFactory,
            this._underlyingIvemId.createCopy(),
        );
    }

    override createRecordDefinition(idx: Integer): CallPutTableRecordDefinition {
        const record = this._recordList[idx];
        return {
            typeId: TableFieldSourceDefinition.TypeId.CallPut,
            mapKey: record.mapKey,
            record,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const callPut = this._recordList[recordIndex];

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId =
                fieldSourceDefinition.typeId as CallPutFromUnderlyingTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            switch (fieldSourceDefinitionTypeId) {
                case TableFieldSourceDefinition.TypeId.CallPut: {
                    const valueSource = new CallPutTableValueSource(this._decimalFactory, result.fieldCount, callPut);
                    result.addSource(valueSource);
                    break;
                }
                case TableFieldSourceDefinition.TypeId.CallSecurityDataItem: {
                    const dataIvemId = callPut.callDataIvemId;
                    if (dataIvemId === undefined) {
                        throw new AssertInternalError('CPFUTRSCTRC68409');
                    } else {
                        // below may not bind to fields correctly - check when testing
                        const valueSource = new SecurityDataItemTableValueSource(this._decimalFactory, this._adiService, result.fieldCount, dataIvemId);
                        result.addSource(valueSource);
                    }
                    break;
                }
                case TableFieldSourceDefinition.TypeId.PutSecurityDataItem: {
                    const dataIvemId = callPut.putDataIvemId;
                    if (dataIvemId === undefined) {
                        throw new AssertInternalError('CPFUTRSCTRC68409');
                    } else {
                        // below may not bind to fields correctly - check when testing
                        const valueSource = new SecurityDataItemTableValueSource(this._decimalFactory, this._adiService, result.fieldCount, dataIvemId);
                        result.addSource(valueSource);
                    }
                    break;
                }
                default:
                    throw new UnreachableCaseError('CPFUTRSCTVL77752', fieldSourceDefinitionTypeId);
            }
        }

        return result;
    }

    override openLocked(opener: LockOpenListItem.Opener) {
        const definition = new SearchSymbolsDataDefinition(this._decimalFactory);

        const condition: SearchSymbolsDataDefinition.Condition = {
            text: this._underlyingIvemId.code,
            fieldIds: [SymbolFieldId.Base],
            isCaseSensitive: false,
            matchIds: [SearchSymbolsDataDefinition.Condition.MatchId.exact],
        };
        definition.exchangeZenithCode = this._underlyingIvemId.exchange.zenithCode;
        definition.conditions = [condition];
        this._dataItem = this._adiService.subscribe(definition) as SymbolsDataItem;
        this._dataItemSubscribed = true;
        super.setSingleDataItem(this._dataItem);
        this._dataItemListChangeEventSubscriptionId = this._dataItem.subscribeListChangeEvent(
            (listChangeTypeId, idx, count) => { this.handleDataItemListChangeEvent(listChangeTypeId, idx, count); }
        );
        this._dataItemBadnessChangedEventSubscriptionId = this._dataItem.subscribeBadnessChangedEvent(
            () => { this.handleDataItemBadnessChangedEvent(); }
        );

        super.openLocked(opener);

        if (this._dataItem.usable) {
            const newCount = this._dataItem.records.length;
            if (newCount > 0) {
                this.processDataItemListChange(UsableListChangeTypeId.PreUsableAdd, 0, newCount);
            }
            this.processDataItemListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.processDataItemListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    override closeLocked(opener: LockOpenListItem.Opener) {
        // TableRecordDefinitionList can no longer be used after it is deactivated
        if (this.count > 0) {
            this.notifyListChange(UsableListChangeTypeId.Clear, 0, 0);
        }

        if (!this._dataItemSubscribed) {
            throw new AssertInternalError('CPFUTRDL234332', '');
        } else {
            this._dataItem.unsubscribeListChangeEvent(this._dataItemListChangeEventSubscriptionId);
            this._dataItemListChangeEventSubscriptionId = undefined;
            this._dataItem.unsubscribeBadnessChangedEvent(this._dataItemBadnessChangedEventSubscriptionId);
            this._dataItemBadnessChangedEventSubscriptionId = undefined;

            super.closeLocked(opener);

            this._adiService.unsubscribe(this._dataItem);
            this._dataItemSubscribed = false;
        }
    }

    protected getCount() { return this._recordList.length; }

    protected override processUsableChanged() {
        if (this.usable) {
            this.notifyListChange(UsableListChangeTypeId.PreUsableClear, 0, 0);
            const count = this.count;
            if (count > 0) {
                this.notifyListChange(UsableListChangeTypeId.PreUsableAdd, 0, count);
            }
            this.notifyListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.notifyListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return CallPutFromUnderlyingTableRecordSourceDefinition.defaultFieldSourceDefinitionTypeIds;
    }

    private handleDataItemListChangeEvent(listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
        this.processDataItemListChange(listChangeTypeId, idx, count);
    }

    private handleDataItemBadnessChangedEvent() {
        this.checkSetUnusable(this._dataItem.badness);
    }

    private processDataItemListChange(listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                this.setUnusable(this._dataItem.badness);
                break;
            case UsableListChangeTypeId.PreUsableClear:
                this.setUnusable(Badness.preUsableClear);
                this._recordList.length = 0;
                break;
            case UsableListChangeTypeId.PreUsableAdd:
                this.setUnusable(Badness.preUsableAdd);
                break;
            case UsableListChangeTypeId.Usable:
                this.processDataItemUsable();
                break;
            case UsableListChangeTypeId.Insert:
                // no action
                break;
            case UsableListChangeTypeId.BeforeReplace:
                throw new AssertInternalError('CPFUTRSPDILCBR19662');
            case UsableListChangeTypeId.AfterReplace:
                throw new AssertInternalError('CPFUTRSPDILCAR19662');
            case UsableListChangeTypeId.BeforeMove:
                throw new AssertInternalError('CPFUTRSPDILCBM19662');
            case UsableListChangeTypeId.AfterMove:
                throw new AssertInternalError('CPFUTRSPDILCAM19662');
            case UsableListChangeTypeId.Remove:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Remove, idx, count);
                this._recordList.splice(idx, count);
                break;
            case UsableListChangeTypeId.Clear:
                this.notifyListChange(UsableListChangeTypeId.Clear, idx, count);
                this._recordList.length = 0;
                break;
            default:
                throw new UnreachableCaseError('SDITRDLPDILC83372992', listChangeTypeId);
        }
    }

    private processDataItemUsable() {
        const symbolDetails = this._dataItem.records;
        const newRecordList = this.createRecordList(symbolDetails);
        this._recordList.splice(0, 0, ...newRecordList);

        this.setUsable(this._dataItem.badness);
    }

    private createRecordList(symbolDetails: SearchSymbolsDataIvemFullDetail[]) {
        const symbolDetailCount = symbolDetails.length;
        const newRecordList = new Array<CallPut>(symbolDetailCount);
        let count = 0;
        const existingIndexMap = new Map<string, Integer>();
        for (let i = 0; i < symbolDetailCount; i++) {
            const symbolDetail = symbolDetails[i];
            const callPutKey = this.tryCreateCallPutKeyFromSymbolDetail(symbolDetail);
            if (callPutKey !== undefined) {
                const callPutMapKey = CallPutFromUnderlyingTableRecordSource.CallPutKey.generateMapKey(callPutKey);
                const existingIndex = existingIndexMap.get(callPutMapKey);
                if (existingIndex === undefined) {
                    const newCallPut = this.createCallPutFromKeyAndSymbolDetail(callPutKey, symbolDetail);
                    if (newCallPut !== undefined) {
                        existingIndexMap.set(callPutMapKey, count);
                        newRecordList[count++] = newCallPut;
                    }
                } else {
                    const existingCallPut = newRecordList[existingIndex];
                    const callOrPutId = symbolDetail.callOrPutId;
                    if (callOrPutId === undefined) {
                        ErrorCodeLogger.logDataError('CPFUTSUCPFSU22995', symbolDetail.dataIvemId.name);
                    } else {
                        const dataIvemId = symbolDetail.dataIvemId;
                        switch (callOrPutId) {
                            case CallOrPutId.Call:
                                if (existingCallPut.callDataIvemId !== undefined) {
                                    ErrorCodeLogger.logDataError('CPUATSUPCPFSC90445', `${existingCallPut.callDataIvemId.name} ${dataIvemId.name}`);
                                } else {
                                    existingCallPut.callDataIvemId = dataIvemId;
                                }
                                break;
                            case CallOrPutId.Put:
                                if (existingCallPut.putDataIvemId !== undefined) {
                                    ErrorCodeLogger.logDataError('CPUATSUPCPFSP33852', `${existingCallPut.putDataIvemId.name} ${dataIvemId.name}`);
                                } else {
                                    existingCallPut.putDataIvemId = dataIvemId;
                                }
                                break;
                            default:
                                throw new UnreachableCaseError('CPUATSUPCPFSD98732', callOrPutId);
                        }
                    }
                }
            }
        }

        newRecordList.length = count;
        return newRecordList;
    }

    private tryCreateCallPutKeyFromSymbolDetail(symbolDetail: SymbolsDataItem.Record): CallPutFromUnderlyingTableRecordSource.CallPutKey | undefined {
        const exercisePrice = symbolDetail.strikePrice;
        if (exercisePrice === undefined) {
            ErrorCodeLogger.logDataError('CPFUTSCKFSP28875', symbolDetail.dataIvemId.name);
            return undefined;
        } else {
            const expiryDate = symbolDetail.expiryDate;
            if (expiryDate === undefined) {
                ErrorCodeLogger.logDataError('CPFUTSCKFSD18557', symbolDetail.dataIvemId.name);
                return undefined;
            } else {
                const market = symbolDetail.dataIvemId.market;
                return {
                    exercisePrice,
                    expiryDate,
                    market,
                }
            }
        }
    }

    private createCallPutFromKeyAndSymbolDetail(key: CallPutFromUnderlyingTableRecordSource.CallPutKey, symbolDetail: SymbolsDataItem.Record): CallPut | undefined {
        const exercisePrice = key.exercisePrice;
        const expiryDate = key.expiryDate;
        const market = key.market;
        const callOrPutId = symbolDetail.callOrPutId;
        if (callOrPutId === undefined) {
            ErrorCodeLogger.logDataError('CPFUTSCCPFKASCP22887', symbolDetail.dataIvemId.name);
            return undefined;
        } else {
            const dataIvemId = symbolDetail.dataIvemId;
            let callDataIvemId: DataIvemId | undefined;
            let putDataIvemId: DataIvemId | undefined;
            switch (callOrPutId) {
                case CallOrPutId.Call:
                    callDataIvemId = dataIvemId;
                    break;
                case CallOrPutId.Put:
                    putDataIvemId = dataIvemId;
                    break;
                default:
                    throw new UnreachableCaseError('CPFUTSCCPFKASD11134', callOrPutId);
            }
            const symbolInfoExerciseTypeId = symbolDetail.exerciseTypeId;
            if (symbolInfoExerciseTypeId === undefined) {
                ErrorCodeLogger.logDataError('CPFUTSCCPFKASE99811', symbolDetail.name);
                return undefined;
            } else {
                const exerciseTypeId = symbolInfoExerciseTypeId;

                const symbolInfoContractMultipler = symbolDetail.contractSize;
                if (symbolInfoContractMultipler === undefined) {
                    ErrorCodeLogger.logDataError('CPFUTSCCPFKASC44477', symbolDetail.dataIvemId.name);
                    return undefined;
                } else {
                    const contractMultiplier = this._decimalFactory.newDecimal(symbolInfoContractMultipler);
                    // currently do not need underlyingIvemId or underlyingIsIndex
                    return new CallPut(
                        exercisePrice,
                        expiryDate,
                        market,
                        contractMultiplier,
                        exerciseTypeId,
                        undefined,
                        undefined,
                        callDataIvemId,
                        putDataIvemId,
                    );
                }
            }
        }
    }
}

export namespace CallPutFromUnderlyingTableRecordSource {
    export interface CallPutKey {
        exercisePrice: Decimal;
        expiryDate: SourceTzOffsetDate,
        market: DataMarket,
    }

    export namespace CallPutKey {
        export function generateMapKey(key: CallPutKey) {
            return CallPut.generateMapKey(key.exercisePrice, key.expiryDate, key.market.zenithCode);
        }
    }
}
