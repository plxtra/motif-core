import {
    AssertInternalError,
    DecimalFactory,
    EnumInfoOutOfOrderError,
    Integer,
    MapKey,
    MultiEvent,
    UnreachableCaseError,
    isDecimalEqual,
    isDecimalGreaterThan,
} from '@pbkware/js-utils';
import { Decimal } from 'decimal.js-light';
import { RevRecordValueRecentChangeTypeId } from 'revgrid';
import { StringId, Strings } from '../res';
import {
    CorrectnessId,
    FieldDataTypeId,
} from "../sys";
import { BrokerageAccount } from './brokerage-account';
import { BrokerageAccountEnvironmentedId } from './brokerage-account-environmented-id';
import { BrokerageAccountRecord } from './brokerage-account-record';
import {
    Currency,
    CurrencyId,
    ExchangeEnvironmentZenithCode
} from './common/internal-api';

export class Balances implements BrokerageAccountRecord {
    private _destroyed = false;

    private _netBalance: Decimal;
    private _trading: Decimal;
    private _nonTrading: Decimal;
    private _unfilledBuys: Decimal;
    private _margin: Decimal;

    private _mapKey: MapKey;

    private _changedMultiEvent = new MultiEvent<Balances.ChangedEventHandler>();
    private _correctnessChangedMultiEvent = new MultiEvent<Balances.FeedCorrectnessChangedEventHandler>();

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        private readonly _account: BrokerageAccount,
        private readonly _currencyId: CurrencyId,
        private _correctnessId: CorrectnessId
    ) {
        this._mapKey = Balances.generateMapKey(this.account.id, this.currencyId);

        const initialValue = this._decimalFactory.newDecimal(Balances.initialValueAsNumber);
        this._netBalance = this._decimalFactory.newDecimal(initialValue);
        this._trading = this._decimalFactory.newDecimal(initialValue);
        this._nonTrading = this._decimalFactory.newDecimal(initialValue);
        this._unfilledBuys = this._decimalFactory.newDecimal(initialValue);
        this._margin = this._decimalFactory.newDecimal(initialValue);
    }

    get destroyed(): boolean { return this._destroyed; }

    get account() { return this._account; }
    get accountId() { return this._account.id; }
    get currencyId() { return this._currencyId; }

    get netBalance(): Decimal { return this._netBalance; }
    get trading(): Decimal { return this._trading; }
    get nonTrading(): Decimal { return this._nonTrading; }
    get unfilledBuys(): Decimal { return this._unfilledBuys; }
    get margin(): Decimal { return this._margin; }

    get correctnessId() { return this._correctnessId; }

    get mapKey() { return this._mapKey; }
    get accountMapKey() { return this._account.mapKey; }

    destroy() {
        this._destroyed = true;
    }

    // createKey(): Balances.Key {
    //     return new Balances.Key(this.accountId, this.currencyId, this.exchangeEnvironment);
    // }

    setListCorrectness(value: CorrectnessId) {
        if (value !== this._correctnessId) {
            this._correctnessId = value;
            this.notifyCorrectnessChanged();
        }
    }

    initialise() {
        const fieldCount = Balances.Field.idCount;
        const valueChanges = new Array<Balances.ValueChange>(fieldCount);
        let valueChangeCount = 0;
        for (let fieldId = 0; fieldId < Balances.Field.idCount; fieldId++) {
            if (Balances.Field.idIsValueChangeable(fieldId)) {
                const initialValue = this._decimalFactory.newDecimal(Balances.initialValueAsNumber);
                const recentChangeTypeId = this.updateField(fieldId, initialValue);
                if (recentChangeTypeId) {
                    valueChanges[valueChangeCount++] = { fieldId, recentChangeTypeId };
                }
            }
        }
        if (valueChangeCount > 0) {
            valueChanges.length = valueChangeCount;
            this.notifyChanged(valueChanges);
        }
    }

    update(balanceValues: Balances.BalanceValue[], count: Integer) {
        const valueChanges = new Array<Balances.ValueChange>(count);
        let valueChangeCount = 0;
        for (let i = 0; i < count; i++) {
            const balanceValue = balanceValues[i];
            const fieldId = Balances.Field.tryBalanceTypeToId(balanceValue.type);
            if (fieldId === undefined) {
                // ignore for now.
            } else {
                const recentChangeTypeId = this.updateField(fieldId, balanceValue.amount);

                if (recentChangeTypeId !== undefined) {
                    valueChanges[valueChangeCount++] = { fieldId, recentChangeTypeId };
                }
            }
        }

        if (valueChangeCount > 0) {
            valueChanges.length = valueChangeCount;
            this.notifyChanged(valueChanges);
        }
    }

    subscribeChangedEvent(handler: Balances.ChangedEventHandler): MultiEvent.DefinedSubscriptionId {
        return this._changedMultiEvent.subscribe(handler);
    }

    unsubscribeChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._changedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeCorrectnessChangedEvent(handler: Balances.FeedCorrectnessChangedEventHandler) {
        return this._correctnessChangedMultiEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._correctnessChangedMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyChanged(valueChanges: Balances.ValueChange[]) {
        const handlers = this._changedMultiEvent.copyHandlers();
        for (let index = 0; index < handlers.length; index++) {
            handlers[index](valueChanges);
        }
    }

    private notifyCorrectnessChanged() {
        const handlers = this._correctnessChangedMultiEvent.copyHandlers();
        for (let index = 0; index < handlers.length; index++) {
            handlers[index]();
        }
    }

    private updateField(fieldId: Balances.FieldId, amount: Decimal) {
        let recentChangeTypeId: RevRecordValueRecentChangeTypeId | undefined;
        switch (fieldId) {
            case Balances.FieldId.NetBalance:
                if (!isDecimalEqual(amount, this._netBalance)) {
                    recentChangeTypeId = isDecimalGreaterThan(amount, this._netBalance)
                        ? RevRecordValueRecentChangeTypeId.Increase
                        : RevRecordValueRecentChangeTypeId.Decrease;
                    this._netBalance = amount;
                }
                break;
            case Balances.FieldId.Trading:
                if (!isDecimalEqual(amount, this._trading)) {
                    recentChangeTypeId = isDecimalGreaterThan(amount, this._trading)
                        ? RevRecordValueRecentChangeTypeId.Increase
                        : RevRecordValueRecentChangeTypeId.Decrease;
                    this._trading = amount;
                }
                break;
            case Balances.FieldId.NonTrading:
                if (!isDecimalEqual(amount, this._nonTrading)) {
                    recentChangeTypeId = isDecimalGreaterThan(amount, this._nonTrading)
                        ? RevRecordValueRecentChangeTypeId.Increase
                        : RevRecordValueRecentChangeTypeId.Decrease;
                    this._nonTrading = amount;
                }
                break;
            case Balances.FieldId.UnfilledBuys:
                if (!isDecimalEqual(amount, this._unfilledBuys)) {
                    recentChangeTypeId = isDecimalGreaterThan(amount, this._unfilledBuys)
                        ? RevRecordValueRecentChangeTypeId.Increase
                        : RevRecordValueRecentChangeTypeId.Decrease;
                    this._unfilledBuys = amount;
                }
                break;
            case Balances.FieldId.Margin:
                if (!isDecimalEqual(amount, this._margin)) {
                    recentChangeTypeId = isDecimalGreaterThan(amount, this._margin)
                        ? RevRecordValueRecentChangeTypeId.Increase
                        : RevRecordValueRecentChangeTypeId.Decrease;
                    this._margin = amount;
                }
                break;
            case Balances.FieldId.AccountId:
            case Balances.FieldId.Currency:
                throw new AssertInternalError('ACBU56599344399');
            default:
                throw new UnreachableCaseError('ACBU545400393', fieldId);
        }
        return recentChangeTypeId;
    }
}

export namespace Balances {
    export type Id = string;
    export const initialValueAsNumber = 0;

    export interface BalanceValue {
        readonly type: string;
        amount: Decimal;
    }

    export type ChangedEventHandler = (valueChanges: ValueChange[]) => void;
    export type FeedCorrectnessChangedEventHandler = (this: void) => void;

    // NonTrading is your unbooked transactions
    // Trading is your Net Balance, less Unbooked, less Unfilled buys, plus Margin
    export const enum FieldId {
        AccountId,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        Currency,
        NetBalance,
        Trading,
        NonTrading,
        UnfilledBuys,
        Margin,
    }

    export namespace Field {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        export type Id = FieldId;

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly balanceType: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfoObject = { [id in keyof typeof FieldId]: Info };

        const infoObject: InfoObject = {
            AccountId: {
                id: FieldId.AccountId,
                name: 'AccountId',
                balanceType: '',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BalancesFieldDisplay_AccountId,
                headingId: StringId.BalancesFieldHeading_AccountId,
            },
            Currency: {
                id: FieldId.Currency,
                name: 'Currency',
                balanceType: '',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.BalancesFieldDisplay_CurrencyId,
                headingId: StringId.BalancesFieldHeading_CurrencyId,
            },
            NetBalance: {
                id: FieldId.NetBalance,
                name: 'NetBalance',
                balanceType: 'NetBalance',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.BalancesFieldDisplay_NetBalance,
                headingId: StringId.BalancesFieldHeading_NetBalance,
            },
            Trading: {
                id: FieldId.Trading,
                name: 'Trading',
                balanceType: 'Trading',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.BalancesFieldDisplay_Trading,
                headingId: StringId.BalancesFieldHeading_Trading,
            },
            NonTrading: {
                id: FieldId.NonTrading,
                name: 'NonTrading',
                balanceType: 'NonTrading',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.BalancesFieldDisplay_NonTrading,
                headingId: StringId.BalancesFieldHeading_NonTrading,
            },
            UnfilledBuys: {
                id: FieldId.UnfilledBuys,
                name: 'UnfilledBuys',
                balanceType: 'UnfilledBuys',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.BalancesFieldDisplay_UnfilledBuys,
                headingId: StringId.BalancesFieldHeading_UnfilledBuys,
            },
            Margin: {
                id: FieldId.Margin,
                name: 'Margin',
                balanceType: 'Margin',
                dataTypeId: FieldDataTypeId.Decimal,
                displayId: StringId.BalancesFieldDisplay_Margin,
                headingId: StringId.BalancesFieldHeading_Margin,
            },
        };

        export const idCount = Object.keys(infoObject).length;
        const infos = Object.values(infoObject);

        export function idToName(id: Id) {
            return infos[id].name;
        }

        export function idToBalanceType(id: Id) {
            return infos[id].balanceType;
        }

        export function tryBalanceTypeToId(value: string): FieldId | undefined {
            for (let id = 0; id < idCount; id++) {
                const info = infos[id];
                if (value === info.balanceType) {
                    return id;
                }
            }
            return undefined;
        }

        export function idIsValueChangeable(id: Id) {
            return infos[id].balanceType.length !== 0;
        }

        export function idToFieldDataTypeId(id: FieldId) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToHeadingId(id: Id) {
            return infos[id].headingId;
        }

        export function idToHeading(id: Id) {
            return Strings[idToHeadingId(id)];
        }

        export function initialiseStaticField() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('ACBFISF222923323', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }
    }

    export function generateMapKey(
        accountId: BrokerageAccountEnvironmentedId,
        currencyId: CurrencyId
    ) {
        const environmentMapKey = ExchangeEnvironmentZenithCode.createMapKey(accountId.environment.zenithCode);
        return `${accountId.code}|${Currency.idToName(currencyId)}|${environmentMapKey}`;
    }

    // export class Key implements KeyedRecord.Key {
    //     static readonly JsonTag_AccountId = 'accountId';
    //     static readonly JsonTag_EnvironmentId = 'environmentId';
    //     static readonly JsonTag_CurrencyId = 'currencyId';

    //     public readonly environmentId: TradingEnvironmentId;

    //     private _mapKey: string;

    //     constructor(
    //         public readonly accountId: BrokerageAccountId,
    //         public readonly currencyId: CurrencyId,
    //         environmentId?: TradingEnvironmentId,
    //     ) {
    //         this.environmentId = environmentId === undefined ? TradingEnvironment.getDefaultId() : environmentId;
    //         this._mapKey = Key.generateMapKey(this.accountId, this.environmentId, this.currencyId);
    //     }

    //     get mapKey() { return this._mapKey; }
    //     // get generateMapKey() {
    //     //     return this._mapKey;
    //     // }

    //     static createNull() {
    //         // will not match any valid holding
    //         return new Key('', CurrencyId.Aud);
    //     }

    //     // saveToJson(element: JsonElement, includeEnvironment = false) {
    //     //     element.setString(Key.JsonTag_CurrencyId, Currency.idToJsonValue(this.currencyId));
    //     //     element.setString(Key.JsonTag_AccountId, this.accountId);
    //     //     if (includeEnvironment) {
    //     //         element.setString(Key.JsonTag_EnvironmentId, TradingEnvironment.idToJsonValue(this.environmentId));
    //     //     }
    //     // }
    // }

    // export namespace Key {
    //     export function generateMapKey(
    //         accountEnvironmentedId: BrokerageAccountEnvironmentedId,
    //         currencyId: CurrencyId
    //     ) {
    //         const environmentMapKey = ExchangeEnvironmentZenithCode.createMapKey(accountEnvironmentedId.environment.zenithCode);
    //         return `${accountEnvironmentedId.id}|${Currency.idToName(currencyId)}|${environmentMapKey}`;
    //     }

    //     export function isEqual(left: Key, right: Key) {
    //         return left.accountId === right.accountId &&
    //             left.currencyId === right.currencyId &&
    //             left.environmentId === right.environmentId;
    //     }

    //     // export function tryCreateFromJson(element: JsonElement) {
    //     //     const jsonCurrencyString = element.tryGetString(Key.JsonTag_CurrencyId);
    //     //     if (jsonCurrencyString === undefined) {
    //     //         return 'Undefined CurrencyId';
    //     //     } else {
    //     //         const currencyId = Currency.tryJsonValueToId(jsonCurrencyString);
    //     //         if (currencyId === undefined) {
    //     //             return `Unknown CurrencyId: ${jsonCurrencyString}`;
    //     //         } else {
    //     //                 const accountId = element.tryGetString(Key.JsonTag_AccountId);
    //     //             if (accountId === undefined) {
    //     //                 return 'Undefined Account';
    //     //             } else {
    //     //                 const jsonEnvironmentString = element.tryGetString(Key.JsonTag_EnvironmentId);
    //     //                 if (jsonEnvironmentString === undefined) {
    //     //                     return new Key(accountId, currencyId);
    //     //                 } else {
    //     //                     const environmentId = TradingEnvironment.tryJsonToId(jsonEnvironmentString);
    //     //                     if (environmentId === undefined) {
    //     //                         return `Unknown EnvironmentId: ${jsonEnvironmentString}`;
    //     //                     } else {
    //     //                         return new Key(accountId, currencyId, environmentId);
    //     //                     }
    //     //                 }
    //     //             }
    //     //         }
    //     //     }
    //     // }
    // }

    export interface ValueChange {
        fieldId: FieldId;
        recentChangeTypeId: RevRecordValueRecentChangeTypeId | undefined;
    }

    // export function createNotFoundBalances(key: Balances.Key) {
    //     const accountKey = new BrokerageAccount.Key(key.accountId, key.environmentId);
    //     const balances = new Balances(BrokerageAccount.createNotFoundAccount(accountKey),
    //         Currency.nullCurrencyId,
    //         CorrectnessId.Error,
    //     );
    //     return balances;
    // }

    export function initialiseStatic() {
        Field.initialiseStaticField();
    }
}

export namespace BalancesModule {
    export function initialiseStatic() {
        Balances.initialiseStatic();
    }
}
