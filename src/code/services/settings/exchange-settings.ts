import { AssertInternalError } from '@pbkware/js-utils';
import { Exchange, MarketsConfig, SymbolField, SymbolFieldId } from '../../adi/internal-api';
import { TypedKeyValueSettings } from './typed-key-value-settings';

export class ExchangeSettings {
    readonly exchangeZenithCode: string;

    private readonly _defaultSymbolSearchFieldIds: readonly SymbolFieldId[];
    private readonly _defaultSymbolNameFieldId: SymbolFieldId;

    private _symbolSearchFieldIds: readonly SymbolFieldId[];
    private _symbolNameFieldId: SymbolFieldId;

    private _infosObject: ExchangeSettings.InfosObject = {
        SymbolNameFieldId: { id: ExchangeSettings.Id.SymbolNameFieldId,
            name: 'symbolNameFieldId',
            operator: ExchangeSettings.operator,
            defaulter: () => TypedKeyValueSettings.formatEnumString(
                SymbolField.idToJsonValue(this._defaultSymbolNameFieldId)
            ),
            getter: () => TypedKeyValueSettings.formatEnumString(SymbolField.idToJsonValue(this._symbolNameFieldId)),
            pusher: (value: TypedKeyValueSettings.PushValue) => {
                if (value.value === undefined) {
                    this._symbolNameFieldId = this._defaultSymbolNameFieldId;
                } else {
                    const id = SymbolField.tryJsonValueToId(value.value);
                    if (id === undefined) {
                        this._symbolNameFieldId = this._defaultSymbolNameFieldId;
                    } else {
                        this._symbolNameFieldId = id;
                    }
                }
            }
        },
        SymbolSearchFieldIds: { id: ExchangeSettings.Id.SymbolSearchFieldIds,
            name: 'symbolSearchFieldIds',
            operator: ExchangeSettings.operator,
            defaulter: () => TypedKeyValueSettings.formatEnumArrayString(
                SymbolField.idArrayToJsonValue(this._defaultSymbolSearchFieldIds)
            ),
            getter: () => TypedKeyValueSettings.formatEnumArrayString(SymbolField.idArrayToJsonValue(this._symbolSearchFieldIds)),
            pusher: (value: TypedKeyValueSettings.PushValue) => {
                if (value.value === undefined) {
                    this._symbolSearchFieldIds = this._defaultSymbolSearchFieldIds.slice();
                } else {
                    const idArray = SymbolField.tryJsonValueToIdArray(value.value);
                    if (idArray === undefined) {
                        this._symbolSearchFieldIds = this._defaultSymbolSearchFieldIds.slice();
                    } else {
                        this._symbolSearchFieldIds = idArray;
                    }
                }
            }
        },
    };

    private readonly _infos = Object.values(this._infosObject);

    constructor(
        readonly exchange: Exchange,
        private readonly _settingChangedEventer: ExchangeSettings.SettingChangedEventer,
    ) {
        this.exchangeZenithCode = exchange.zenithCode;

        if (ExchangeSettings.idCount !== this._infos.length) {
            throw new AssertInternalError('ESCIC23331', `${ExchangeSettings.idCount} !== ${this._infos.length}`);
        } else {
            const defaultSymbolSearchFieldIds = exchange.defaultSymbolSearchFieldIds;
            this._defaultSymbolSearchFieldIds = defaultSymbolSearchFieldIds;
            this._symbolSearchFieldIds = defaultSymbolSearchFieldIds;
            const defaultSymbolFieldName = exchange.defaultSymbolNameFieldId;
            this._defaultSymbolNameFieldId = defaultSymbolFieldName;
            this._symbolNameFieldId = defaultSymbolFieldName;
        }
    }

    get infos() { return this._infos; }

    get symbolNameFieldId() { return this._symbolNameFieldId; }
    set symbolNameFieldId(value: SymbolFieldId) {
        this._symbolNameFieldId = value;
        this._settingChangedEventer(ExchangeSettings.Id.SymbolNameFieldId);
    }

    get symbolSearchFieldIds() { return this._symbolSearchFieldIds; }
    set symbolSearchFieldIds(value: readonly SymbolFieldId[]) {
        this._symbolSearchFieldIds = value;
        this._settingChangedEventer(ExchangeSettings.Id.SymbolSearchFieldIds);
    }
}

export namespace ExchangeSettings {
    export const enum Id {
        SymbolNameFieldId,
        SymbolSearchFieldIds,
    }

    export const idCount = 2;
    export const operator = true;

    export type SettingChangedEventer = (this: void, id: Id) => void;

    export type InfosObject = { [id in keyof typeof Id]: TypedKeyValueSettings.Info };

    export const defaultDefaultSymbolSearchFieldIds = MarketsConfig.Exchange.defaultAllowedSymbolSearchFieldIds;
    // export const defaultDefaultSymbolSearchFieldIds = (() => calculateDefaultDefaultSymbolSearchFieldIds())();
    export const defaultDefaultSymbolNameFieldId = MarketsConfig.Exchange.defaultAllowedSymbolNameFieldIds[0];
    // export const defaultDefaultSymbolNameFieldId = (() => calculateDefaultDefaultSymbolNameFieldId())();
}
