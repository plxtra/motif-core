import { compareString, ComparisonResult, EnumInfoOutOfOrderError, Integer, MultiEvent } from '@xilytix/sysutils';
import { StringId, Strings } from '../../res/internal-api';
import { FieldDataTypeId } from '../../sys/internal-api';
import { TradingState, ZenithEnvironmentedValueParts, ZenithMarketBoard } from '../common/internal-api';
// eslint-disable-next-line import/no-cycle
import { DataMarket } from './data-market';

export class MarketBoard {
    readonly unenvironmentedZenithCode: string;

    private readonly _fieldValuesChangedMultiEvent = new MultiEvent<MarketBoard.FieldValuesChangedHandler>();

    private _destroyed = false;
    private _feedInitialising = false;

    private _beginChangeCount = 0;
    private _changedValueFieldIds = new Array<MarketBoard.FieldId>();

    // id: MarketBoardId;
    // environmentId: DataEnvironmentId;
    constructor(
        readonly zenithCode: string,
        readonly name: string,
        readonly display: string,
        readonly market: DataMarket,
        private _status: string | undefined,
        private _allowIds: TradingState.AllowIds | undefined,
        private _reasonId: TradingState.ReasonId | undefined,
        readonly unknown = false,
    ) {
        this.unenvironmentedZenithCode = ZenithEnvironmentedValueParts.getValueFromString(this.zenithCode);
    }

    get destroyed(): boolean { return this._destroyed; }
    get feedInitialising(): boolean { return this._feedInitialising; }
    get status(): string | undefined { return this._status; }
    get allowIds(): TradingState.AllowIds | undefined { return this._allowIds; }
    get reasonId(): TradingState.ReasonId | undefined { return this._reasonId; }

    destroy() {
        this._destroyed = false;
    }

    clone(): MarketBoard {
        const copy = new MarketBoard(
            this.zenithCode,
            this.name,
            this.display,
            this.market,
            this._status,
            this._allowIds,
            this._reasonId,
        );

        copy._destroyed = this.destroyed;

        return copy;
    }

    createZenithMarketBoard(): ZenithMarketBoard | undefined {
        const status = this._status;
        if (status === undefined) {
            return undefined;
        } else {
            return {
                zenithCode: this.zenithCode,
                status,
            };
        }
    }

    beginChange() {
        if (this._beginChangeCount++ === 0) {
            this._changedValueFieldIds.length = 0;
        }
    }

    endChange() {
        if (--this._beginChangeCount === 0) {
            if (this._changedValueFieldIds.length > 0) {
                const changedValueFieldIds = this._changedValueFieldIds;
                this._changedValueFieldIds.length = 0;
                this.notifyFieldValuesChanged(changedValueFieldIds);
            }
        }
    }

    checkSetFeedInitialising(value: boolean): void {
        if (this._feedInitialising) {
            if (!value) {
                this.beginChange();
                this._feedInitialising = false;
                this.addFieldValueChange(MarketBoard.FieldId.FeedInitialising);
                this.update(Strings[StringId.FeedWaitingStatus], undefined, undefined);
                this.endChange()
            }
        } else {
            if (value) {
                this.beginChange();
                this._feedInitialising = true;
                this.addFieldValueChange(MarketBoard.FieldId.FeedInitialising);
                this.update(Strings[StringId.FeedInitialising], undefined, undefined);
                this.endChange()
            }
        }
    }

    update(status: string, allowIds: TradingState.AllowIds | undefined, reasonId: TradingState.ReasonId | undefined) {
        this.beginChange();
        if (status !== this._status) {
            this._status = status;
            this.addFieldValueChange(MarketBoard.FieldId.Status);
        }

        if (allowIds !== this._allowIds) {
            this._allowIds = allowIds;
            this.addFieldValueChange(MarketBoard.FieldId.AllowIds);
        }

        if (reasonId !== this._reasonId) {
            this._reasonId = reasonId;
            this.addFieldValueChange(MarketBoard.FieldId.ReasonId);
        }
        this.endChange()
    }

    subscribeFieldValuesChangedEvent(handler: MarketBoard.FieldValuesChangedHandler) {
        return this._fieldValuesChangedMultiEvent.subscribe(handler);
    }

    unsubscribeFieldValuesChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._fieldValuesChangedMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyFieldValuesChanged(changedValueFieldIds: readonly MarketBoard.FieldId[]) {
        const handlers = this._fieldValuesChangedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler(changedValueFieldIds);
        }
    }

    private addFieldValueChange(fieldId: MarketBoard.FieldId) {
        if (!this._changedValueFieldIds.includes(fieldId)) {
            this._changedValueFieldIds.push(fieldId);
        }
    }
}

export namespace MarketBoard {
    export type FieldValuesChangedHandler = (this: void, changedValueFieldIds: readonly FieldId[]) => void;
    export type ComparePropertyToStringFtn = (this: void, marketBoard: MarketBoard, value: string) => ComparisonResult;

    export const enum FieldId {
        ZenithCode,
        Name,
        Display,
        Unknown,
        Market,
        FeedInitialising,
        Status,
        AllowIds,
        ReasonId,
    }

    export namespace Field {
        interface Info {
            readonly id: FieldId;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };

        const infosObject: InfosObject = {
            ZenithCode: {
                id: FieldId.ZenithCode,
                name: 'ZenithCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketBoardFieldDisplay_ZenithCode,
                headingId: StringId.MarketBoardFieldHeading_ZenithCode,
            },
            Name: {
                id: FieldId.Name,
                name: 'Name',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketBoardFieldDisplay_Name,
                headingId: StringId.MarketBoardFieldHeading_Name,
            },
            Display: {
                id: FieldId.Display,
                name: 'Display',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketBoardFieldDisplay_Display,
                headingId: StringId.MarketBoardFieldHeading_Display,
            },
            Unknown: {
                id: FieldId.Unknown,
                name: 'Unknown',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.MarketBoardFieldDisplay_Unknown,
                headingId: StringId.MarketBoardFieldHeading_Unknown,
            },
            Market: {
                id: FieldId.Market,
                name: 'Market',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketBoardFieldDisplay_Market,
                headingId: StringId.MarketBoardFieldHeading_Market,
            },
            FeedInitialising: {
                id: FieldId.FeedInitialising,
                name: 'FeedInitialising',
                dataTypeId: FieldDataTypeId.Boolean,
                displayId: StringId.MarketBoardFieldDisplay_FeedInitialising,
                headingId: StringId.MarketBoardFieldHeading_FeedInitialising,
            },
            Status: {
                id: FieldId.Status,
                name: 'Status',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.MarketBoardFieldDisplay_Status,
                headingId: StringId.MarketBoardFieldHeading_Status,
            },
            AllowIds: {
                id: FieldId.AllowIds,
                name: 'AllowIds',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                displayId: StringId.MarketBoardFieldDisplay_AllowIds,
                headingId: StringId.MarketBoardFieldHeading_AllowIds,
            },
            ReasonId: {
                id: FieldId.ReasonId,
                name: 'ReasonId',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.MarketBoardFieldDisplay_ReasonId,
                headingId: StringId.MarketBoardFieldHeading_ReasonId,
            },
        };

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        (function initialiseField() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('MarketBoard.FieldId', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        })();

        export function idToName(id: FieldId) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: FieldId) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: FieldId) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: FieldId) {
            return Strings[idToDisplayId(id)];
        }

        export function idToHeadingId(id: FieldId) {
            return infos[id].headingId;
        }

        export function idToHeading(id: FieldId) {
            return Strings[idToHeadingId(id)];
        }
    }

    export function indexOfInArray(boards: readonly MarketBoard[], zenithCode: string): Integer {
        const count = boards.length;
        for (let i = 0; i < count; i++) {
            const board = boards[i];
            if (board.zenithCode === zenithCode) {
                return i;
            }
        }

        return -1;
    }

    export function findInArray(boards: readonly MarketBoard[], zenithCode: string): MarketBoard | undefined {
        for (const board of boards) {
            if (board.zenithCode === zenithCode) {
                return board;
            }
        }
        return undefined;
    }

    export function cloneArray(boards: readonly MarketBoard[]): MarketBoard[] {
        const count = boards.length;
        const copy = new Array<MarketBoard>(count);
        for (let i = 0; i < count; i++) {
            copy[i] = boards[i].clone();
        }
        return copy;
    }

    export function compareByZenithCode(left: MarketBoard, right: MarketBoard) {
        return compareString(left.zenithCode, right.zenithCode);
    }

    export function compareToZenithCode(marketboard: MarketBoard, zenithCode: string) {
        return compareString(marketboard.zenithCode, zenithCode);
    }

    export function compareByUnenvironmentedZenithCode(left: MarketBoard, right: MarketBoard) {
        return compareString(left.unenvironmentedZenithCode, right.unenvironmentedZenithCode);
    }

    export function compareToUnenvironmentedZenithCode(marketboard: MarketBoard, unenvironmentedZenithCode: string) {
        return compareString(marketboard.unenvironmentedZenithCode, unenvironmentedZenithCode);
    }

    export function createUnknown(market: DataMarket, zenithCode: string): MarketBoard {
        const result = new MarketBoard(
            zenithCode,
            '',
            '',
            market,
            undefined,
            undefined,
            undefined,
            true,
        );
        return result;
    }
}
