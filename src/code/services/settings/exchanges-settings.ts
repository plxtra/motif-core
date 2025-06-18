import { Integer, MultiEvent, UsableListChangeTypeId } from '@pbkware/js-utils';
import { Exchange, MarketsService, SymbolFieldId } from '../../adi';
import { ExchangeSettings } from './exchange-settings';
import { TypedKeyValueArraySettingsGroup } from './typed-key-value-array-settings-group';

export class ExchangesSettings extends TypedKeyValueArraySettingsGroup {
    readonly settingsArray = new Array<ExchangeSettings>();

    private readonly _exchanges: MarketsService.Exchanges;

    private _exchangesListChangeSubscriptionId: MultiEvent.SubscriptionId;

    constructor(private readonly _marketsService: MarketsService) {
        super(ExchangesSettings.groupName);

        const exchanges = this._marketsService.exchanges;
        this._exchanges = exchanges;

        const exchangeCount = exchanges.count;
        this.settingsArray.length = exchangeCount;
        for (let i = 0; i < exchangeCount; i++) {
            const exchange = exchanges.getAt(i);
            const settings = this.createSettings(exchange);
            this.settingsArray[i] = settings;
        }

        this._exchangesListChangeSubscriptionId = exchanges.subscribeListChangeEvent(
            (listChangeTypeId, idx, count) => this.handleExchangesListChangeEvent(listChangeTypeId, idx, count)
        );
    }

    finalise() {
        this._exchanges.unsubscribeListChangeEvent(this._exchangesListChangeSubscriptionId);
        this._exchangesListChangeSubscriptionId = undefined;
    }

    findExchange(exchange: Exchange): ExchangeSettings | undefined {
        const linkedSettings = exchange.settings;
        if (linkedSettings !== undefined) {
            return linkedSettings as ExchangeSettings;
        } else {
            const zenithCode = exchange.zenithCode;
            const settingsArray = this.settingsArray;
            const count = settingsArray.length;
            for (let i = 0; i < count; i++) {
                const settings = settingsArray[i];
                if (settings.exchangeZenithCode === zenithCode) {
                    exchange.settings = settings;
                    return settings;
                }
            }
            return undefined;
        }
    }

    getSymbolNameFieldId(exchange: Exchange) {
        const settings = this.findExchange(exchange);
        if (settings !== undefined) {
            return settings.symbolNameFieldId;
        } else {
            // Must be unknown exchange - return default default
            return ExchangeSettings.defaultDefaultSymbolNameFieldId;
        }
    }

    setSymbolNameField(exchange: Exchange, value: SymbolFieldId) {
        const settings = this.findExchange(exchange);
        if (settings !== undefined) {
            settings.symbolNameFieldId = value;
        }
    }

    getSymbolSearchFieldIds(exchange: Exchange) {
        const settings = this.findExchange(exchange);
        if (settings !== undefined) {
            return settings.symbolSearchFieldIds;
        } else {
            // Must be unknown exchange - return default default
            return ExchangeSettings.defaultDefaultSymbolSearchFieldIds;
        }
    }

    setSymbolSearchFieldIds(exchange: Exchange, value: SymbolFieldId[]) {
        const settings = this.findExchange(exchange);
        if (settings !== undefined) {
            settings.symbolSearchFieldIds = value;
        }
    }

    protected getNamedInfoArrays(operator: boolean) {
        if (operator !== ExchangeSettings.operator) {
            return [];
        } else {
            const count = this.settingsArray.length;
            const result = new Array<TypedKeyValueArraySettingsGroup.NamedInfoArray>(count);
            for (let i = 0; i < count; i++) {
                const settings = this.settingsArray[i];
                const namedInfoArray: TypedKeyValueArraySettingsGroup.NamedInfoArray = {
                    name: settings.exchangeZenithCode,
                    operator: ExchangeSettings.operator,
                    infoArray: settings.infos,
                };
                result[i] = namedInfoArray;
            }

            return result;
        }
    }

    private handleExchangeSettingChangedEvent(settingId: ExchangeSettings.Id) {
        this.settingChangedEvent(settingId);
    }

    private handleExchangesListChangeEvent(listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
        if (listChangeTypeId === UsableListChangeTypeId.Insert || listChangeTypeId === UsableListChangeTypeId.PreUsableAdd) {
            const endPlus1Idx = idx + count;
            const exchanges = this._exchanges;
            for (let i = idx; i < endPlus1Idx; i++) {
                const exchange = exchanges.getAt(i);
                const foundSettings = this.findExchange(exchange);
                if (foundSettings === undefined) {
                    const settings = this.createSettings(exchange);
                    this.settingsArray.push(settings);
                }
            }
        }
    }

    private createSettings(exchange: Exchange) {
        const settings = new ExchangeSettings(exchange, (settingId) => { this.handleExchangeSettingChangedEvent(settingId); } );
        exchange.settings = settings;
        return settings;
    }
}

export namespace ExchangesSettings {
    export const groupName = 'exchanges';
}
