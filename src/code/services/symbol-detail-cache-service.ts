import {
    AssertInternalError,
    DecimalFactory,
    MapKey,
    MultiEvent,
    SourceTzOffsetDate,
    SysTick,
    UnreachableCaseError,
    addToCapacitisedArrayUniquely,
    mSecsPerHour,
} from '@pbkware/js-utils';
import { Decimal } from 'decimal.js-light';
import {
    CallOrPutId,
    DataDefinition,
    DataIvemAlternateCodes,
    DataIvemAttributes,
    DataIvemId,
    DataMgr,
    DepthDirectionId,
    Exchange,
    ExerciseTypeId,
    IvemClassId,
    IvemId,
    MarketsService,
    PublisherSubscriptionDataTypeId,
    SearchSymbolsDataDefinition,
    SearchSymbolsDataIvemBaseDetail,
    SearchSymbolsDataIvemFullDetail,
    SymbolFieldId,
    SymbolsDataItem,
    TmcLegs,
    TradingMarket
} from '../adi/internal-api';
import { StringId, Strings } from '../res/internal-api';
import { CorrectnessId } from '../sys/internal-api';
import { SymbolsService } from './symbols-service';

export class SymbolDetailCacheService {
    private readonly _dataIvemIdMap: DataIvemIdMap = new Map<MapKey, SymbolDetailCacheService.DataIvemIdDetail>();
    private readonly _ivemIdMap: IvemIdMap = new Map<MapKey, SymbolDetailCacheService.IvemIdDetail>();

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        private readonly _marketsService: MarketsService,
        private readonly _dataMgr: DataMgr,
        private readonly _symbolsService: SymbolsService
    ) { }

    finalise() {
        this.clear();
    }

    getDataIvemIdFromCache(dataIvemId: DataIvemId) {
        return this._dataIvemIdMap.get(dataIvemId.mapKey);
    }

    getIvemIdFromCache(ivemId: IvemId) {
        return this._ivemIdMap.get(ivemId.mapKey);
    }

    getDataIvemId(dataIvemId: DataIvemId): Promise<SymbolDetailCacheService.DataIvemIdDetail | undefined> {
        const now = SysTick.now();
        const key = dataIvemId.mapKey;
        let detail = this._dataIvemIdMap.get(key);
        if (detail !== undefined) {
            if (detail.expireTime < now) {
                // expired in cache - delete
                // make sure it does not have a request
                if (detail.request !== undefined) {
                    // unusual - never got resolved - resolve with timeout error
                    detail.expired = true;
                    detail.errorText = `${dataIvemId.name}: ${Strings[StringId.SymbolCache_UnresolvedRequestTimedOut]}`;
                    detail.request.resolve(detail);
                }
                this._dataIvemIdMap.delete(key);
                detail = undefined;
            }
        }

        let request: DataIvemIdRequest;

        if (detail === undefined) {
            detail = this.createEmptyDataIvemIdDetail(dataIvemId);
            this._dataIvemIdMap.set(key, detail);
            request = new DataIvemIdRequest(this._decimalFactory, this._dataMgr, detail);
            detail.request = request;
        } else {
            const possiblyUndefinedRequest = detail.request;
            if (possiblyUndefinedRequest === undefined) {
                // already resolved
                return Promise.resolve(detail);
            } else {
                request = possiblyUndefinedRequest as DataIvemIdRequest;
            }
        }

        return new Promise<SymbolDetailCacheService.DataIvemIdDetail | undefined>(
            (resolve) => { this.assignDataIvemIdThenExecutor(resolve, request); }
        );
    }

    setDataIvemId(dataIvemDetail: SearchSymbolsDataIvemBaseDetail, baseOverwriteFullAllowed = false) {
        const dataIvemId = dataIvemDetail.dataIvemId;

        if (SearchSymbolsDataIvemFullDetail.is(dataIvemDetail)) {
            this.setFullDataIvemId(dataIvemDetail)
        } else {
            if (baseOverwriteFullAllowed) {
                this.setBaseDataIvemId(dataIvemDetail);
            } else {
                const existingDetail = this.getDataIvemIdFromCache(dataIvemId);
                // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
                if (existingDetail === undefined || !existingDetail.full) {
                    this.setBaseDataIvemId(dataIvemDetail);
                }
            }
        }
    }

    setBaseDataIvemId(dataIvemDetail: SearchSymbolsDataIvemBaseDetail) {
        const dataIvemId = dataIvemDetail.dataIvemId;
        const dataIvemIdDetail: SymbolDetailCacheService.DataIvemIdDetail = {
            expireTime: this.calculateExpireTime(),
            request: undefined,
            expired: false,
            full: false,
            errorText: undefined,
            exists: true,
            dataIvemId: dataIvemDetail.dataIvemId,
            ivemClassId: dataIvemDetail.ivemClassId,
            subscriptionDataTypeIds: dataIvemDetail.subscriptionDataTypeIds,
            tradingMarkets: dataIvemDetail.tradingMarkets,
            name: dataIvemDetail.name,
            exchange: dataIvemDetail.exchange,
            alternateCodes: dataIvemDetail.alternateCodes,
        };
        this._dataIvemIdMap.set(dataIvemId.mapKey, dataIvemIdDetail);
    }

    getFullDataIvemId(dataIvemId: DataIvemId): Promise<SymbolDetailCacheService.FullDataIvemIdDetail | undefined> {
        const now = SysTick.now();
        const key = dataIvemId.mapKey;
        let detail = this._dataIvemIdMap.get(key);
        if (detail !== undefined) {
            if (detail.expireTime < now) {
                // expired in cache - delete
                // make sure it does not have a request
                if (detail.request !== undefined) {
                    // unusual - never got resolved - resolve with timeout error
                    detail.expired = true;
                    detail.errorText = `${dataIvemId.name}: ${Strings[StringId.SymbolCache_UnresolvedRequestTimedOut]}`;
                    detail.request.resolve(detail);
                }
                this._dataIvemIdMap.delete(key);
                detail = undefined;
            }
        }

        let fullDetail: SymbolDetailCacheService.FullDataIvemIdDetail | undefined;
        if (detail === undefined) {
            fullDetail = undefined;
        } else {
            if (SymbolDetailCacheService.Detail.isFullDataIvemId(detail)) {
                fullDetail = detail;
            } else {
                fullDetail = undefined;
            }
        }

        let request: FullDataIvemIdRequest;

        if (fullDetail === undefined) {
            fullDetail = this.createEmptyFullDataIvemIdDetail(dataIvemId);
            this._dataIvemIdMap.set(key, fullDetail);
            request = new FullDataIvemIdRequest(this._decimalFactory, this._dataMgr, fullDetail);
            fullDetail.request = request;
        } else {
            const possiblyUndefinedRequest = fullDetail.request;
            if (possiblyUndefinedRequest === undefined) {
                // already resolved
                return Promise.resolve(fullDetail);
            } else {
                request = possiblyUndefinedRequest as FullDataIvemIdRequest;
            }
        }

        return new Promise<SymbolDetailCacheService.FullDataIvemIdDetail | undefined>(
            (resolve) => { this.assignFullDataIvemIdThenExecutor(resolve, request); }
        );
    }

    setFullDataIvemId(detail: SearchSymbolsDataIvemFullDetail) {
        const dataIvemId = detail.dataIvemId;
        const dataIvemIdDetail: SymbolDetailCacheService.FullDataIvemIdDetail = {
            expireTime: this.calculateExpireTime(),
            request: undefined,
            expired: false,
            errorText: undefined,
            exists: true,
            full: true,
            dataIvemId,
            ivemClassId: detail.ivemClassId,
            subscriptionDataTypeIds: detail.subscriptionDataTypeIds,
            tradingMarkets: detail.tradingMarkets,
            name: detail.name,
            exchange: detail.exchange,
            depthDirectionId: detail.depthDirectionId,
            isIndex: detail.isIndex,
            expiryDate: SourceTzOffsetDate.newUndefinable(detail.expiryDate),
            strikePrice: this._decimalFactory.newUndefinableDecimal(detail.strikePrice),
            exerciseTypeId: detail.exerciseTypeId,
            callOrPutId: detail.callOrPutId,
            contractSize: this._decimalFactory.newUndefinableDecimal(detail.contractSize),
            lotSize: this._decimalFactory.newUndefinableDecimal(detail.lotSize),
            attributes: detail.attributes,
            alternateCodes: detail.alternateCodes,
            tmcLegs: detail.tmcLegs,
        };
        this._dataIvemIdMap.set(dataIvemId.mapKey, dataIvemIdDetail);
    }

    getIvemId(ivemId: IvemId, full: boolean, skipCacheCheck: boolean): Promise<SymbolDetailCacheService.IvemIdDetail | undefined> {
        const now = SysTick.now();
        const key = ivemId.mapKey;
        let detail: SymbolDetailCacheService.IvemIdDetail | undefined;
        if (skipCacheCheck) {
            detail = undefined;
        } else {
            detail = this._ivemIdMap.get(key);
        }
        if (detail !== undefined) {
            if (detail.expireTime < now) {
                // expired in cache - delete
                // make sure it does not have a request
                if (detail.request !== undefined) {
                    // unusual - never got resolved - resolve with timeout error
                    detail.expired = true;
                    detail.errorText = `${ivemId.name}: ${Strings[StringId.SymbolCache_UnresolvedRequestTimedOut]}`;
                    detail.request.resolve(detail);
                }
                this._ivemIdMap.delete(key);
                detail = undefined;
            }
        }

        let request: IvemIdRequest;

        if (detail === undefined || (full && !detail.full)) {
            detail = this.createEmptyIvemIdDetail(ivemId, full);
            this._ivemIdMap.set(key, detail);
            request = new IvemIdRequest(this._decimalFactory, this._dataMgr, detail,
                (dataIvemId, fullRequest) => this.handleGetDataIvemIdDetailForIvemIdEvent(dataIvemId, fullRequest)
            );
            detail.request = request;
        } else {
            const possiblyUndefinedRequest = detail.request;
            if (possiblyUndefinedRequest === undefined) {
                // already resolved
                return Promise.resolve(detail);
            } else {
                request = possiblyUndefinedRequest as IvemIdRequest;
            }
        }

        return new Promise<SymbolDetailCacheService.IvemIdDetail | undefined>(
            (resolve) => { this.assignIvemIdThenExecutor(resolve, request); }
        );
    }

    clear() {
        this.clearIvemIds();
        this.clearDataIvemIds();
    }

    // createEmptyIvemIdDetailFromTradingIvemId(tradingIvemId: TradingIvemId) {
    //     const tradingMarket = tradingIvemId.market;
    //     const bestDataIvemId = tradingIvemId.bestLitDataIvemId;
    //     const ivemId = tradingIvemId.ivemId;

    //     const dataIvemName = this._symbolsService.tradingIvemIdToDisplay(tradingIvemId);

    //     const dataIvemIdDetail: SymbolDetailCacheService.DataIvemIdDetail = {
    //         expired: true,
    //         expireTime: SysTick.now(),
    //         errorText: undefined,
    //         request: undefined,
    //         exists: true,
    //         full: false,
    //         dataIvemId: bestDataIvemId,
    //         ivemClassId: IvemClassId.Unknown,
    //         subscriptionDataTypeIds: [],
    //         tradingMarkets: [tradingMarket],
    //         name: dataIvemName, // symbolsService.routedIvemIdToDisplay(routedIvemId),
    //         exchange: tradingMarket.exchange,
    //     };

    //     const ivemIdDetail: SymbolDetailCacheService.IvemIdDetail = {
    //         expired: true,
    //         expireTime: SysTick.now(),
    //         errorText: undefined,
    //         request: undefined,
    //         exists: true,
    //         full: false,
    //         ivemId,
    //         dataIvemIdDetails: [dataIvemIdDetail],
    //         name: this._symbolsService.ivemIdToDisplay(tradingIvemId.ivemId),
    //     };

    //     return ivemIdDetail;
    // }

    private clearDataIvemIds() {
        const entryIterator = this._dataIvemIdMap.values();
        let entryResult = entryIterator.next();
        while (!entryResult.done) {
            const detail = entryResult.value;
            const request = detail.request;
            if (request !== undefined) {
                request.cancel();
            }
            entryResult = entryIterator.next();
        }
    }

    private clearIvemIds() {
        const entryIterator = this._ivemIdMap.values();
        let entryResult = entryIterator.next();
        while (!entryResult.done) {
            const detail = entryResult.value;
            const request = detail.request;
            if (request !== undefined) {
                request.cancel();
            }
            entryResult = entryIterator.next();
        }
    }

    private createEmptyDataIvemIdDetail(dataIvemId: DataIvemId) {
        const detail: SymbolDetailCacheService.DataIvemIdDetail = {
            expireTime: this.calculateExpireTime(),
            request: undefined,
            expired: true,
            exists: false,
            full: false,
            errorText: undefined,

            dataIvemId,

            // the rest are empty
            ivemClassId: IvemClassId.ManagedFund,
            subscriptionDataTypeIds: [],
            tradingMarkets: [],
            name: '',
            exchange: this._marketsService.genericUnknownExchange,
        };

        return detail;
    }

    private createEmptyFullDataIvemIdDetail(dataIvemId: DataIvemId) {
        const detail: SymbolDetailCacheService.FullDataIvemIdDetail = {
            expireTime: this.calculateExpireTime(),
            request: undefined,
            expired: true,
            exists: false,
            full: true,
            errorText: undefined,

            dataIvemId,

            // the rest are empty
            ivemClassId: IvemClassId.ManagedFund,
            subscriptionDataTypeIds: [],
            tradingMarkets: [],
            name: '',
            exchange: this._marketsService.genericUnknownExchange,

            depthDirectionId: undefined,
            isIndex: undefined,
            expiryDate: undefined,
            strikePrice: undefined,
            exerciseTypeId: undefined,
            callOrPutId: undefined,
            contractSize: undefined,
            lotSize: undefined,
            attributes: undefined,
            alternateCodes: {},
            tmcLegs: undefined,
        };

        return detail;
    }

    private createEmptyIvemIdDetail(ivemId: IvemId, full: boolean) {
        const detail: SymbolDetailCacheService.IvemIdDetail = {
            expireTime: this.calculateExpireTime(),
            request: undefined,
            expired: true,
            exists: false,
            full,
            errorText: undefined,
            ivemId,
            name: '',
            dataIvemIdDetails: [],
        };

        return detail;
    }

    private assignDataIvemIdThenExecutor(resolveFtn: DataIvemIdResolveFtn, request: DataIvemIdRequest) {
        if (request.dataItem !== undefined) {
            request.resolveFtnArray.push(resolveFtn);
        } else {
            // for some reason, was settled before Then Executor assigned.  Just resolve
            resolveFtn(request.detail);
        }
    }

    private assignFullDataIvemIdThenExecutor(resolveFtn: FullDataIvemIdResolveFtn, request: FullDataIvemIdRequest) {
        if (request.dataItem !== undefined) {
            request.resolveFtnArray.push(resolveFtn);
        } else {
            // for some reason, was settled before Then Executor assigned.  Just resolve
            resolveFtn(request.detail);
        }
    }

    private assignIvemIdThenExecutor(resolveFtn: IvemIdResolveFtn, request: IvemIdRequest) {
        if (request.dataItem !== undefined) {
            request.resolveFtnArray.push(resolveFtn);
        } else {
            // for some reason, was settled before Then Executor assigned.  Just resolve
            resolveFtn(request.detail);
        }
    }

    private handleGetDataIvemIdDetailForIvemIdEvent(dataIvemId: DataIvemId, full: boolean) {
        const key = dataIvemId.mapKey;
        let detail = this._dataIvemIdMap.get(key);
        if (detail === undefined || full && !detail.full) {
            if (full) {
                detail = this.createEmptyFullDataIvemIdDetail(dataIvemId)
            } else {
                detail = this.createEmptyDataIvemIdDetail(dataIvemId);
            }
            this._dataIvemIdMap.set(key, detail);
        }
        return detail;
    }

    private calculateExpireTime() {
        return SysTick.now() + SymbolDetailCacheService.Detail.ValidSpan;
    }
}

type DataIvemIdResolveFtn = (this: void, value: SymbolDetailCacheService.DataIvemIdDetail | undefined) => void;
type FullDataIvemIdResolveFtn = (this: void, value: SymbolDetailCacheService.FullDataIvemIdDetail | undefined) => void;
type IvemIdResolveFtn = (this: void, value: SymbolDetailCacheService.IvemIdDetail | undefined) => void;

type DataIvemIdMap = Map<MapKey, SymbolDetailCacheService.DataIvemIdDetail>;
type IvemIdMap = Map<MapKey, SymbolDetailCacheService.IvemIdDetail>;

abstract class Request {
    dataItem: SymbolsDataItem | undefined;
    dataCorrectnessChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _dataMgr: DataMgr, definition: DataDefinition) {
        this.dataItem = this._dataMgr.subscribe(definition) as SymbolsDataItem;
        this.dataCorrectnessChangeSubscriptionId = this.dataItem.subscribeCorrectnessChangedEvent(
            () => { this.handleDataCorrectnessChangedEvent(); }
        );
        // note that since this is a query, it will never be ready immediately
    }


    protected checkUnsubscribeDataItem() {
        if (this.dataItem !== undefined) {
            const subscriptionId = this.dataCorrectnessChangeSubscriptionId;
            if (subscriptionId !== undefined) {
                this.dataItem.unsubscribeCorrectnessChangedEvent(subscriptionId);
                this.dataCorrectnessChangeSubscriptionId = undefined;
            }
            this._dataMgr.unsubscribe(this.dataItem);
            this.dataItem = undefined;
        }
    }

    private handleDataCorrectnessChangedEvent() {
        this.processCorrectnessChanged();
    }

    private processCorrectnessChanged() {
        if (this.dataItem === undefined) {
            throw new AssertInternalError('SCRPDISC3434998');
        } else {
            switch (this.dataItem.correctnessId) {
                case CorrectnessId.Error:
                    this.processDataItemError(this.dataItem);
                    break;
                case CorrectnessId.Usable:
                case CorrectnessId.Good:
                    this.processDataItemUsable(this.dataItem);
                    break;
                case CorrectnessId.Suspect:
                    // do nothing
                    break;
                default:
                    throw new UnreachableCaseError('SDCPDCC98888343', this.dataItem.correctnessId);
            }
        }
    }

    abstract resolve(detail: SymbolDetailCacheService.Detail | undefined): void;
    abstract cancel(): void;

    protected abstract processDataItemUsable(dataItem: SymbolsDataItem): void;
    protected abstract processDataItemError(dataItem: SymbolsDataItem): void;
}

class DataIvemIdRequest extends Request {
    resolveFtnArray: DataIvemIdResolveFtn[] = [];

    constructor(decimalFactory: DecimalFactory, dataMgr: DataMgr, private _detail: SymbolDetailCacheService.DataIvemIdDetail) {
        super(dataMgr, DataIvemIdRequest.createDataDefinition(decimalFactory, _detail.dataIvemId, false));
    }

    get detail() { return this._detail; }

    resolve(detail: SymbolDetailCacheService.DataIvemIdDetail | undefined) {
        const ftnArray = this.resolveFtnArray;
        for (let i = 0; i < ftnArray.length; i++) {
            const ftn = ftnArray[i];
            ftn(detail);
        }
        this.resolveFtnArray.length = 0;

        this.checkUnsubscribeDataItem();
        this._detail.request = undefined; // remove reference to this request.  Request object should be deleted
    }

    cancel() {
        this.resolve(undefined);
    }

    protected processDataItemUsable(dataItem: SymbolsDataItem) {
        const detail = this._detail;
        detail.expired = false;
        const records = dataItem.records;
        if (records.length === 0) {
            detail.exists = false;
        } else {
            detail.exists = true;
            const record = records[0];
            SymbolDetailCacheService.DataIvemIdDetail.loadFromSymbolRecord(detail, record);
        }
        this.resolve(detail);
    }

    protected processDataItemError(dataItem: SymbolsDataItem) {
        const detail = this._detail;
        detail.expired = true;
        detail.errorText = `${detail.dataIvemId.name}: ${dataItem.errorText}`;
        this.resolve(detail);
    }
}

namespace DataIvemIdRequest {

    export function createDataDefinition(decimalFactory: DecimalFactory, dataIvemId: DataIvemId, fullDetail: boolean) {
        const condition: SearchSymbolsDataDefinition.Condition = {
            text: dataIvemId.code,
            fieldIds: [SymbolFieldId.Code],
            isCaseSensitive: true,
            matchIds: [SearchSymbolsDataDefinition.Condition.MatchId.exact],
        };

        const definition = new SearchSymbolsDataDefinition(decimalFactory);
        definition.conditions = [condition];
        definition.marketZenithCodes = [dataIvemId.marketZenithCode];
        definition.preferExact = true;
        definition.fullSymbol = fullDetail;
        return definition;
    }
}

class FullDataIvemIdRequest extends Request {
    resolveFtnArray: FullDataIvemIdResolveFtn[] = [];

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        dataMgr: DataMgr,
        private readonly _detail: SymbolDetailCacheService.FullDataIvemIdDetail
    ) {
        super(dataMgr, DataIvemIdRequest.createDataDefinition(_decimalFactory, _detail.dataIvemId, true));
    }

    get detail() { return this._detail; }

    resolve(detail: SymbolDetailCacheService.FullDataIvemIdDetail | undefined) {
        const ftnArray = this.resolveFtnArray;
        for (let i = 0; i < ftnArray.length; i++) {
            const ftn = ftnArray[i];
            ftn(detail);
        }
        this.resolveFtnArray.length = 0;

        this.checkUnsubscribeDataItem();
        this._detail.request = undefined; // remove reference to this request.  Request object should be deleted
    }

    cancel() {
        this.resolve(undefined);
    }

    protected processDataItemUsable(dataItem: SymbolsDataItem) {
        const detail = this._detail;
        detail.expired = false;
        const records = dataItem.records;
        if (records.length === 0) {
            detail.exists = false;
        } else {
            detail.exists = true;
            const record = records[0];
            SymbolDetailCacheService.FullDataIvemIdDetail.loadFromSymbolRecord(this._decimalFactory, detail, record);
        }
        this.resolve(detail);
    }

    protected processDataItemError(dataItem: SymbolsDataItem) {
        const detail = this._detail;
        detail.expired = true;
        detail.errorText = `${detail.dataIvemId.name}: ${dataItem.errorText}`;
        this.resolve(detail);
    }
}

class IvemIdRequest extends Request {
    resolveFtnArray: IvemIdResolveFtn[] = [];

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        dataMgr: DataMgr,
        private readonly _detail: SymbolDetailCacheService.IvemIdDetail,
        private _getDataIvemIdDetailEvent: IvemIdRequest.GetDataIvemIdDetailEventHandler,
    ) {
        super(dataMgr, IvemIdRequest.createDataDefinition(_decimalFactory, _detail.ivemId, _detail.full));
    }

    get detail() { return this._detail; }

    resolve(detail: SymbolDetailCacheService.IvemIdDetail | undefined) {
        const ftnArray = this.resolveFtnArray;
        for (let i = 0; i < ftnArray.length; i++) {
            const ftn = ftnArray[i];
            ftn(detail);
        }
        this.resolveFtnArray.length = 0;

        this.checkUnsubscribeDataItem();
        this._detail.request = undefined; // remove reference to this request.  Request object should be deleted
    }

    cancel() {
        this.resolve(undefined);
    }

    protected processDataItemUsable(dataItem: SymbolsDataItem) {
        const detail = this._detail;
        detail.expired = false;
        const records = dataItem.records;
        const recordCount = records.length;
        if (recordCount === 0) {
            detail.exists = false;
        } else {
            const defaultLitMarket = detail.ivemId.exchange.defaultLitMarket;
            const dataIvemIdDetails = new Array<SymbolDetailCacheService.DataIvemIdDetail>(recordCount);

            const full = detail.full;
            for (let i = 0; i < recordCount; i++) {
                const record = records[i];
                const dataIvemId = record.dataIvemId;
                if (dataIvemId.market === defaultLitMarket) {
                    detail.name = record.name;
                }
                const dataIvemIdDetail = this._getDataIvemIdDetailEvent(dataIvemId, full);
                if (!dataIvemIdDetail.exists || dataIvemIdDetail.expired || !dataIvemIdDetail.full) {
                    // detail may or may not already be populated.  Populate again if not previously populated with full
                    dataIvemIdDetail.expired = false;
                    dataIvemIdDetail.exists = true;
                    if (full) {
                        if (SymbolDetailCacheService.Detail.isFullDataIvemId(dataIvemIdDetail)) {
                            SymbolDetailCacheService.FullDataIvemIdDetail.loadFromSymbolRecord(this._decimalFactory, dataIvemIdDetail, record);
                        } else {
                            throw new AssertInternalError('SDCSIIRPDIU22087');
                        }
                    } else {
                        dataIvemIdDetail.full = false;
                        SymbolDetailCacheService.DataIvemIdDetail.loadFromSymbolRecord(dataIvemIdDetail, record);
                    }
                }
                dataIvemIdDetails[i] = dataIvemIdDetail;
            }

            detail.name = records[0].name;

            detail.exists = true;
            detail.dataIvemIdDetails = dataIvemIdDetails;
        }

        this.resolve(detail);
    }

    protected processDataItemError(dataItem: SymbolsDataItem) {
        const detail = this._detail;
        detail.expired = true;
        detail.errorText = `${detail.ivemId.name}: ${dataItem.errorText}`;
        this.resolve(detail);
    }
}

namespace IvemIdRequest {
    export type GetDataIvemIdDetailEventHandler = (dtaIvemId: DataIvemId, full: boolean) => SymbolDetailCacheService.DataIvemIdDetail;

    export function createDataDefinition(decimalFactory: DecimalFactory, ivemId: IvemId, full: boolean) {
        const condition: SearchSymbolsDataDefinition.Condition = {
            text: ivemId.code,
            fieldIds: [SymbolFieldId.Code],
            isCaseSensitive: true,
            matchIds: [SearchSymbolsDataDefinition.Condition.MatchId.exact],
        };

        const definition = new SearchSymbolsDataDefinition(decimalFactory);
        definition.conditions = [condition];
        definition.exchangeZenithCode = ivemId.exchange.zenithCode;
        definition.preferExact = true;
        definition.fullSymbol = full;
        return definition;
    }
}

export namespace SymbolDetailCacheService {

    export interface Detail {
        request: Request | undefined;
        expireTime: SysTick.Time;
        expired: boolean;
        exists: boolean;
        full: boolean;
        errorText: string | undefined;
    }

    export namespace Detail {
        export const ValidSpan = 8 * mSecsPerHour;

        export function isDataIvemId(detail: Detail): detail is DataIvemIdDetail {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            return (detail as DataIvemIdDetail).dataIvemId !== undefined;
        }

        export function isFullDataIvemId(detail: Detail): detail is FullDataIvemIdDetail {
            return isDataIvemId(detail) && detail.full;
        }
    }

    export interface DataIvemIdDetail extends Detail {
        dataIvemId: DataIvemId;
        ivemClassId: IvemClassId;
        subscriptionDataTypeIds: readonly PublisherSubscriptionDataTypeId[];
        tradingMarkets: readonly TradingMarket[];
        name: string;
        exchange: Exchange;
        alternateCodes?: AlternateCodes; // In future, plan to move alternateCodes from Full to base detail. In some cases now, Full is used to masquerade Base to get alternate Codes.  This optional field provides support
    }

    export type Attributes = DataIvemAttributes;

    export namespace DataIvemIdDetail {
        export function loadFromSymbolRecord(detail: DataIvemIdDetail, record: SymbolsDataItem.Record) {
            // objects and arrays are immutable so references are ok
            detail.ivemClassId = record.ivemClassId;
            detail.subscriptionDataTypeIds = record.subscriptionDataTypeIds;
            detail.tradingMarkets = record.tradingMarkets;
            detail.name = record.name;
            detail.exchange = record.exchange;
            detail.alternateCodes = record.alternateCodes;
        }
    }

    export type AlternateCodes = DataIvemAlternateCodes;

    export interface FullDataIvemIdDetail extends DataIvemIdDetail {
        depthDirectionId: DepthDirectionId | undefined;
        isIndex: boolean | undefined;
        expiryDate: SourceTzOffsetDate | undefined;
        strikePrice: Decimal | undefined;
        exerciseTypeId: ExerciseTypeId | undefined;
        callOrPutId: CallOrPutId | undefined;
        contractSize: Decimal | undefined;
        lotSize: Decimal | undefined;
        attributes: Attributes | undefined;
        tmcLegs: TmcLegs | undefined;
        alternateCodes: AlternateCodes;
    }

    export namespace FullDataIvemIdDetail {
        export function loadFromSymbolRecord(decimalFactory: DecimalFactory, detail: FullDataIvemIdDetail, record: SymbolsDataItem.Record) {
            // objects and arrays are immutable so references are ok
            detail.ivemClassId = record.ivemClassId;
            detail.subscriptionDataTypeIds = record.subscriptionDataTypeIds;
            detail.tradingMarkets = record.tradingMarkets;
            detail.name = record.name;
            detail.exchange = record.exchange;
            detail.alternateCodes = record.alternateCodes;
            detail.depthDirectionId = record.depthDirectionId;
            detail.isIndex = record.isIndex;
            detail.expiryDate = SourceTzOffsetDate.newUndefinable(record.expiryDate);
            detail.strikePrice = decimalFactory.newUndefinableDecimal(record.strikePrice);
            detail.exerciseTypeId = record.exerciseTypeId;
            detail.callOrPutId = record.callOrPutId;
            detail.contractSize = decimalFactory.newUndefinableDecimal(record.contractSize);
            detail.lotSize = decimalFactory.newUndefinableDecimal(record.lotSize);
            detail.attributes = record.attributes;
            detail.tmcLegs = record.tmcLegs;
        }
    }

    export interface IvemIdDetail extends Detail {
        ivemId: IvemId;
        name: string;
        dataIvemIdDetails: readonly DataIvemIdDetail[];
    }

    export namespace IvemIdDetail {
        export function getMarketBoards(detail: IvemIdDetail) {
            const dataDetails = detail.dataIvemIdDetails;
            const dataCount = dataDetails.length;
            if (dataCount === 1) {
                return dataDetails[0].tradingMarkets;
            } else {
                const tradingMarkets = new Array<TradingMarket>(dataCount * 4); // guess maximum count
                let marketBoardCount = 0;

                for (let i = 0; i < dataCount; i++) {
                    const dataDetail = dataDetails[i];
                    const recordTradingMarkets = dataDetail.tradingMarkets;
                    marketBoardCount = addToCapacitisedArrayUniquely(tradingMarkets, marketBoardCount, recordTradingMarkets);
                }

                tradingMarkets.length = marketBoardCount;

                return tradingMarkets;
            }
        }

        export function calculateAlternateCodes(detail: IvemIdDetail) {
            const dataIvemIdDetails = detail.dataIvemIdDetails;
            const dataIvemIdDetailCount = dataIvemIdDetails.length;

            for (let i = 0; i < dataIvemIdDetailCount; i++) {
                const dataIvemIdDetail = dataIvemIdDetails[i];
                const dataIvemIdAlternateCodes = dataIvemIdDetail.alternateCodes;
                if (dataIvemIdAlternateCodes !== undefined) {
                    return dataIvemIdAlternateCodes; // just use first one found
                }
            }

            return undefined;
        }
    }
}
