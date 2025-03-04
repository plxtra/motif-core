import { RevRecordValueRecentChangeTypeId } from '@xilytix/revgrid';
import {
    EnumInfoOutOfOrderError,
    Integer,
    MultiEvent
} from '@xilytix/sysutils';
import { StringId, Strings } from '../res/internal-api';
import {
    Correctness,
    CorrectnessId,
    FieldDataTypeId,
    KeyedCorrectnessListItem,
} from "../sys/internal-api";
import { BrokerageAccountEnvironmentedId } from './brokerage-account-environmented-id';
import {
    BrokerageAccountsDataMessage,
    CurrencyId,
    FeedStatus
} from './common/internal-api';
import { TradingFeed } from './feed/internal-api';

export class BrokerageAccount implements KeyedCorrectnessListItem {
    readonly mapKey: string;

    private _destroyed = false;

    private _upperName: string;

    private _usable = false;
    private _correctnessId = CorrectnessId.Suspect;

    private _tradingFeedCorrectnessChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _tradingFeedStatusChangedSubscriptionId: MultiEvent.SubscriptionId;

    private _changeEvent = new MultiEvent<BrokerageAccount.ChangeEventHandler>();
    private _correctnessChangedEvent = new MultiEvent<BrokerageAccount.CorrectnessChangedEventHandler>();

    constructor(
        readonly zenithCode: string,
        readonly id: BrokerageAccountEnvironmentedId,
        // private _id: Account.Id,
        // private _environmentId: TradingEnvironmentId,
        readonly tradingFeed: TradingFeed,
        private _name: string,
        private _currencyId: CurrencyId | undefined,
        private _brokerCode: string | undefined,
        private _branchCode: string | undefined,
        private _advisorCode: string | undefined,
        private _listCorrectnessId: CorrectnessId,
    ) {
        this.mapKey = zenithCode;

        this._upperName = this._name.toUpperCase();
        // Need to get FeedStatus correctness information from TradingFeed as TradingFeed correctness not availabe from DataItem
        this._tradingFeedCorrectnessChangedSubscriptionId = this.tradingFeed.subscribeCorrectnessChangedEvent(
            () => { this.updateCorrectness(); }
        );
        this._tradingFeedStatusChangedSubscriptionId = this.tradingFeed.subscribeStatusChangedEvent(
            () => { this.updateCorrectness(); }
        );
        this.updateCorrectness();
    }

    get destroyed(): boolean { return this._destroyed; }

    get name() { return this._name; }
    get currencyId(): CurrencyId | undefined { return this._currencyId; }
    get upperName() { return this._upperName; }
    // get environmentId() { return this._environmentId; }
    get brokerCode() { return this._brokerCode; }
    get branchCode() { return this._branchCode; }
    get advisorCode() { return this._advisorCode; }

    get usable() { return this._usable; }
    get correctnessId() { return this._correctnessId; }

    // get mapKey() {
    //     if (this._mapKey === undefined) {
    //         this._mapKey = Account.Key.generateMapKey(this.id, this.environmentId);
    //     }
    //     return this._mapKey;
    // }

    destroy() {
        this.tradingFeed.unsubscribeCorrectnessChangedEvent(this._tradingFeedCorrectnessChangedSubscriptionId);
        this.tradingFeed.unsubscribeStatusChangedEvent(this._tradingFeedStatusChangedSubscriptionId);
        this._destroyed = true;
    }

    // createKey(): Account.Key {
    //     return new Account.Key(this.id, this.environmentId);
    // }

    setListCorrectness(value: CorrectnessId) {
        this._listCorrectnessId = value;
        this.updateCorrectness();
    }

    change(msgAccount: BrokerageAccountsDataMessage.Account) {
        const valueChanges = new Array<BrokerageAccount.ValueChange>(BrokerageAccount.Field.idCount - BrokerageAccount.Field.readonlyCount); // won't include fields in key
        let changedCount = 0;

        const newName = msgAccount.name;
        if (newName !== undefined && newName !== this.name) {
            this._name = newName;
            this._upperName = newName.toUpperCase();
            valueChanges[changedCount++] = {
                fieldId: BrokerageAccount.FieldId.Name,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        const newCurrencyId = msgAccount.currencyId;
        if (newCurrencyId !== undefined && newCurrencyId !== this.currencyId) {
            this._currencyId = newCurrencyId;
            valueChanges[changedCount++] = {
                fieldId: BrokerageAccount.FieldId.Currency,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
            };
        }

        const newBrokerCode = msgAccount.brokerCode;
        if (newBrokerCode !== undefined) {
            let resolvedBrokerCode: string | undefined;
            if (newBrokerCode === null) {
                resolvedBrokerCode = undefined;
            } else {
                resolvedBrokerCode = newBrokerCode
            }
            if (resolvedBrokerCode !== this.brokerCode) {
                this._brokerCode = resolvedBrokerCode;
                valueChanges[changedCount++] = {
                    fieldId: BrokerageAccount.FieldId.BrokerCode,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
        }

        const newBranchCode = msgAccount.branchCode;
        if (newBranchCode !== undefined) {
            let resolvedBranchCode: string | undefined;
            if (newBranchCode === null) {
                resolvedBranchCode = undefined;
            } else {
                resolvedBranchCode = newBranchCode
            }
            if (resolvedBranchCode !== this.branchCode) {
                this._branchCode = resolvedBranchCode;
                valueChanges[changedCount++] = {
                    fieldId: BrokerageAccount.FieldId.BranchCode,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
        }

        const newAdvisorCode = msgAccount.advisorCode;
        if (newAdvisorCode !== undefined) {
            let resolvedAdvisorCode: string | undefined;
            if (newAdvisorCode === null) {
                resolvedAdvisorCode = undefined;
            } else {
                resolvedAdvisorCode = newAdvisorCode
            }
            if (resolvedAdvisorCode !== this.advisorCode) {
                this._advisorCode = resolvedAdvisorCode;
                valueChanges[changedCount++] = {
                    fieldId: BrokerageAccount.FieldId.AdvisorCode,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update
                };
            }
        }

        if (changedCount >= 0) {
            valueChanges.length = changedCount;
            this.notifyChange(valueChanges);
        }
    }

    subscribeChangeEvent(handler: BrokerageAccount.ChangeEventHandler) {
        return this._changeEvent.subscribe(handler);
    }

    unsubscribeChangeEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._changeEvent.unsubscribe(subscriptionId);
    }

    subscribeCorrectnessChangedEvent(handler: BrokerageAccount.CorrectnessChangedEventHandler) {
        return this._correctnessChangedEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._correctnessChangedEvent.unsubscribe(subscriptionId);
    }

    private notifyChange(valueChanges: BrokerageAccount.ValueChange[]) {
        const handlers = this._changeEvent.copyHandlers();
        for (const handler of handlers) {
            handler(valueChanges);
        }
    }

    private notifyCorrectnessChanged() {
        const handlers = this._correctnessChangedEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private updateCorrectness() {
        // Note that there is not any FeedBrokerageAccountDataItem
        // BrokerageAccountDataItem correctness only takes into account Authority Feed - not Trading Feed
        // It is possible to get Trading Feed status from either Account messages or TradingFeed
        // Use TradingFeed status so all accounts are simultaneously updated if Trading Feed changes
        // Need to make sure that TradingFeed is usable.  This ensures that it also takes into account OrderStatuses being ready

        let correctnessId: CorrectnessId;
        if (this.tradingFeed.usable) {
            const tradingFeedStatusCorrectnessId = FeedStatus.idToCorrectnessId(this.tradingFeed.statusId);
            correctnessId = Correctness.merge2Ids(this._listCorrectnessId, tradingFeedStatusCorrectnessId);
        } else {
            correctnessId = Correctness.merge2Ids(this._listCorrectnessId, this.tradingFeed.correctnessId);
        }

        if (correctnessId !== this._correctnessId) {
            this._correctnessId = correctnessId;
            this._usable = Correctness.idIsUsable(correctnessId);
            this.notifyCorrectnessChanged();
        }
    }
}

export namespace BrokerageAccount {
    export function isEqual(left: BrokerageAccount, right: BrokerageAccount): boolean {
        return BrokerageAccountEnvironmentedId.isEqual(left.id, right.id);
    }

    export const enum FieldId {
        IdDisplay,
        EnvironmentZenithCode,
        Name,
        Currency,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        BrokerCode,
        BranchCode,
        AdvisorCode,
    }

    export interface ValueChange {
        fieldId: FieldId;
        recentChangeTypeId: RevRecordValueRecentChangeTypeId;
    }

    export type ChangeEventHandler = (this: void, valueChanges: BrokerageAccount.ValueChange[]) => void;
    export type CorrectnessChangedEventHandler = (this: void) => void;

    export namespace Field {
        interface Info {
            readonly id: FieldId;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfoObjects = { [id in keyof typeof FieldId]: Info };

        const infoObjects: InfoObjects = {
            IdDisplay: {
                id: FieldId.IdDisplay,
                name: 'IdDisplay',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BrokerageAccountFieldDisplay_IdDisplay,
                headingId: StringId.BrokerageAccountFieldHeading_IdDisplay,
            },
            EnvironmentZenithCode: {
                id: FieldId.EnvironmentZenithCode,
                name: 'EnvironmentZenithCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BrokerageAccountFieldDisplay_EnvironmentZenithCode,
                headingId: StringId.BrokerageAccountFieldHeading_EnvironmentZenithCode,
            },
            Name: {
                id: FieldId.Name,
                name: 'Name',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BrokerageAccountFieldDisplay_Name,
                headingId: StringId.BrokerageAccountFieldHeading_Name,
            },
            Currency: {
                id: FieldId.Currency,
                name: 'Currency',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.BrokerageAccountFieldDisplay_CurrencyId,
                headingId: StringId.BrokerageAccountFieldHeading_CurrencyId,
            },
            // FeedName: {
            //     id: FieldId.FeedName,
            //     name: 'FeedName',
            //     dataTypeId: FieldDataTypeId.String,
            //     displayId: StringId.BrokerageAccountFieldDisplay_TradingFeedName,
            //     headingId: StringId.BrokerageAccountFieldHeading_TradingFeedName,
            // },
            // FeedStatusId: {
            //     id: FieldId.FeedStatusId,
            //     name: 'FeedStatusId',
            //     dataTypeId: FieldDataTypeId.Enumeration,
            //     displayId: StringId.BrokerageAccountFieldDisplay_FeedStatusId,
            //     headingId: StringId.BrokerageAccountFieldHeading_FeedStatusId,
            // },
            BrokerCode: {
                id: FieldId.BrokerCode,
                name: 'BrokerCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BrokerageAccountFieldDisplay_BrokerCode,
                headingId: StringId.BrokerageAccountFieldHeading_BrokerCode,
            },
            BranchCode: {
                id: FieldId.BranchCode,
                name: 'BranchCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BrokerageAccountFieldDisplay_BranchCode,
                headingId: StringId.BrokerageAccountFieldHeading_BranchCode,
            },
            AdvisorCode: {
                id: FieldId.AdvisorCode,
                name: 'AdvisorCode',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.BrokerageAccountFieldDisplay_AdvisorCode,
                headingId: StringId.BrokerageAccountFieldHeading_AdvisorCode,
            },
        };

        export const readonlyCount = 2; // Id and ZenithEnvironmentCode
        const infos = Object.values(infoObjects);
        export const idCount = infos.length;

        export function idToName(id: FieldId) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: FieldId) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: FieldId) {
            return infos[id].displayId;
        }

        export function idToHeadingId(id: FieldId) {
            return infos[id].headingId;
        }

        export function idToHeading(id: FieldId) {
            return Strings[idToHeadingId(id)];
        }

        export function initialiseField() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as FieldId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('BrokerageAccountsDataItem.FieldId', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }
    }

//     export class Key implements KeyedRecord.Key {
//         static readonly JsonTag_Id = 'id';
//         static readonly JsonTag_EnvironmentId = 'environmentId';

//         private readonly _environmentId: TradingEnvironmentId;

//         constructor(readonly mapKey: string) {
//         }

//         // get id() { return this._id; }
//         // get environmentId() { return this._environmentId; }
//         // get mapKey() { return this._mapKey; }

//         static createNull() {
//             // will not match any valid holding
//             return new Key('');
//         }

//         compareTo(other: Key) {
//             const result = BrokerageAccountId.compare(this.id, other.id);
//             if (result === 0) {
//                 return TradingEnvironment.compareId(this.environmentId, other.environmentId);
//             } else {
//                 return result;
//             }
//         }

//         saveToJson(element: JsonElement, includeEnvironment = false) {
//             element.setString(Key.JsonTag_Id, this.id);
//             if (includeEnvironment) {
//                 element.setString(Key.JsonTag_EnvironmentId, TradingEnvironment.idToJsonValue(this.environmentId));
//             }
//         }
//     }

//     export namespace Key {
//         export const fieldCount = 2; // uses 2 fields: id and environmentId

//         export function generateMapKey(id: string, environmentId: TradingEnvironmentId): MapKey {
//             return TradingEnvironment.idToCode(environmentId) + '|' + id;
//         }

//         export function toString(accountId: Account.Id): string {
//             return accountId;
//         }

//         // eslint-disable-next-line @typescript-eslint/no-shadow
//         export function isEqual(left: Key, right: Key) {
//             return left.id === right.id &&
//                 left.environmentId === right.environmentId;
//         }

//         export function tryCreateFromJson(element: JsonElement): Result<Account.Key> {
//             const idResult = element.tryGetString(Key.JsonTag_Id);
//             if (idResult.isErr()) {
//                 return JsonElementErr.createOuter(idResult.error, ErrorCode.Account_IdNotSpecified);
//             } else {
//                 const environmentResult = element.tryGetString(Key.JsonTag_EnvironmentId);
//                 if (environmentResult.isErr()) {
//                     const key = new Key(idResult.value);
//                     return new Ok(key);
//                 } else {
//                     const environmentJsonValue = environmentResult.value;
//                     const environmentId = TradingEnvironment.tryJsonToId(environmentJsonValue);
//                     if (environmentId === undefined) {
//                         return new Err(`${ErrorCode.Account_EnvironmentIdIsInvalid}(${environmentJsonValue})`);
//                     } else {
//                         const key = new Key(idResult.value, environmentId);
//                         return new Ok(key);
//                     }
//                 }
//             }
//         }
//     }

//     export function createNotFoundAccount(key: Account.Key) {
//         const account = new Account(
//             key.id,
//             `<${Strings[StringId.BrokerageAccountNotFound]}!>`,
//             key.environmentId,
//             TradingFeed.nullFeed,
//             undefined,
//             undefined,
//             undefined,
//             CorrectnessId.Error,
//         );
//         return account;
//     }
}
