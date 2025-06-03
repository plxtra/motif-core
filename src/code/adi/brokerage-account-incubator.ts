import { getErrorMessage } from '@pbkware/js-utils';
import { BrokerageAccount } from './brokerage-account';
import { BrokerageAccountsDataItem } from './brokerage-accounts-data-item';
import { BrokerageAccountsDataDefinition } from './common/internal-api';
import { AdiService, DataItemIncubator } from './data-item/internal-api';

export class BrokerageAccountIncubator {
    private _dataItem: BrokerageAccountsDataItem | undefined;
    private _brokerageAccountsDataItemIncubator: DataItemIncubator<BrokerageAccountsDataItem>;

    private _resolveFtn: BrokerageAccountIncubator.ResolveFtn | undefined;
    private _rejectFtn: BrokerageAccountIncubator.RejectFtn | undefined;

    constructor(private _adi: AdiService) {
        this._brokerageAccountsDataItemIncubator = new DataItemIncubator(this._adi);
    }

    get incubating() {
        return this._brokerageAccountsDataItemIncubator.incubating;
    }

    initialise() {
        const brokerageAccountsDefinition = new BrokerageAccountsDataDefinition();
        this._brokerageAccountsDataItemIncubator.initiateSubscribeIncubation(brokerageAccountsDefinition);
    }

    finalise() {
        this._brokerageAccountsDataItemIncubator.finalise();
    }

    incubate(accountZenithCode: string) {
        if (this._dataItem !== undefined) {
            // ready - no incubation necessary
            const result: BrokerageAccountIncubator.CancellableAccount = {
                cancelled: false,
                account: this._dataItem.getAccount(accountZenithCode)
            } as const;
            return result;
        } else {
            if (this._brokerageAccountsDataItemIncubator.incubating) {
                return this.incubateInitialised(accountZenithCode);
            } else {
                this.initialise();
                return this.incubateInitialised(accountZenithCode);
            }
        }
    }

    cancel() {
        const result: BrokerageAccountIncubator.CancellableAccount = {
            cancelled: true,
            account: undefined
        } as const;
        this.checkResolve(result);
    }

    private checkResolve(result: BrokerageAccountIncubator.CancellableAccount) {
        if (this._resolveFtn) {
            this._resolveFtn(result);
            this._resolveFtn = undefined;
            this._rejectFtn = undefined;
        }
    }

    private checkReject(reason: string) {
        if (this._rejectFtn) {
            this._rejectFtn(reason);
            this._resolveFtn = undefined;
            this._rejectFtn = undefined;
        }
    }

    private assignThenFunctions(resolveFtn: BrokerageAccountIncubator.ResolveFtn,
                                rejectFtn: BrokerageAccountIncubator.RejectFtn) {
        // cancel previous - if any
        const result: BrokerageAccountIncubator.CancellableAccount = {
            cancelled: true,
            account: undefined
        } as const;
        this.checkResolve(result);

        // assign
        this._resolveFtn = resolveFtn;
        this._rejectFtn = rejectFtn;
    }

    private incubateInitialised(accountZenithCode: string) {
        // waiting for DataItem
        const promiseOrDataItem = this._brokerageAccountsDataItemIncubator.getInitiatedDataItemSubscriptionOrPromise();
        if (promiseOrDataItem === undefined) {
            const result: BrokerageAccountIncubator.CancellableAccount = {
                cancelled: true,
                account: undefined
            } as const;
            return result;
        } else {
            if (this._brokerageAccountsDataItemIncubator.isDataItem(promiseOrDataItem)) {
                // should not happen as we already know we are incubating
                this._dataItem = promiseOrDataItem;
                const result: BrokerageAccountIncubator.CancellableAccount = {
                    cancelled: false,
                    account: this._dataItem.getAccount(accountZenithCode)
                } as const;
                return result;
            } else {
                // still waiting - assign then for DataItemIncubator
                promiseOrDataItem.then(
                    // incubating finished
                    (dataItem) => {
                        let result: BrokerageAccountIncubator.CancellableAccount;
                        if (dataItem === undefined) {
                            // cancelled
                            result = { cancelled: true, account: undefined } as const;
                        } else {
                            this._dataItem = dataItem;
                            result = { cancelled: false, account: this._dataItem.getAccount(accountZenithCode) } as const;
                        }
                        this.checkResolve(result);
                    },
                    (reason: unknown) => {
                        const errorText = getErrorMessage(reason);
                        this.checkReject(errorText);
                    }
                );
                return new Promise<BrokerageAccountIncubator.CancellableAccount>(
                    (resolve, reject) => { this.assignThenFunctions(resolve, reject); }
                );
            }
        }
    }
}

export namespace BrokerageAccountIncubator {
    export interface CancellableAccount {
        cancelled: boolean;
        account: BrokerageAccount | undefined;
    }
    export type ResolveFtn = (this: void, cancellableAccount: CancellableAccount ) => void;
    export type RejectFtn = (this: void, reason: string) => void;

    export function isCancellableAccount(promiseOrCancellableAccount: CancellableAccount | Promise<CancellableAccount>):
        promiseOrCancellableAccount is CancellableAccount {
        const assumedCancellabelAccount = promiseOrCancellableAccount as CancellableAccount;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return assumedCancellabelAccount.cancelled !== undefined || assumedCancellabelAccount.account !== undefined;
    }
}
