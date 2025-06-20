import { AssertInternalError, Integer, MultiEvent, UnreachableCaseError, UsableListChangeTypeId } from '@pbkware/js-utils';
import { Badness } from '../sys';
import { BrokerageAccount } from './brokerage-account';
import { BrokerageAccountsDataItem } from './brokerage-accounts-data-item';
import { BrokerageAccountsDataDefinition } from './common/internal-api';
import { DataItem } from './data-item/internal-api';

export abstract class AllBrokerageAccountsListChangeDataItem extends DataItem {
    private _accountsDataItem: BrokerageAccountsDataItem;
    private _accountsListChangeSubscriptionId: MultiEvent.SubscriptionId;
    private _accountsBadnessChangedSubscriptionId: MultiEvent.SubscriptionId;

    protected get accounts(): BrokerageAccount[] { return this._accountsDataItem.records; }

    protected override start() {
        const accountDataDefinition = new BrokerageAccountsDataDefinition();
        this._accountsDataItem = this.subscribeDataItem(accountDataDefinition) as BrokerageAccountsDataItem;
        this._accountsBadnessChangedSubscriptionId = this._accountsDataItem.subscribeBadnessChangedEvent(
            () => { this.handleAccountsBadnessChangedEvent(); }
        );
        this._accountsListChangeSubscriptionId = this._accountsDataItem.subscribeListChangeEvent(
            (listChangeType, index, count) => { this.handleAccountsListChangeEvent(listChangeType, index, count); }
        );

        if (this._accountsDataItem.usable) {
            const allCount = this._accountsDataItem.count;
            if (allCount > 0) {
                this.processAccountsListChange(UsableListChangeTypeId.PreUsableAdd, 0, allCount);
            }
            this.processAccountsListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.processAccountsListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }

        super.start();
    }

    protected override stop() {
        this.processAccountsClear();

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._accountsDataItem !== undefined) {
            this._accountsDataItem.unsubscribeListChangeEvent(this._accountsListChangeSubscriptionId);
            this._accountsDataItem.unsubscribeBadnessChangedEvent(this._accountsBadnessChangedSubscriptionId);
            this.unsubscribeDataItem(this._accountsDataItem);
            this._accountsDataItem = undefined as unknown as BrokerageAccountsDataItem;
        }

        super.stop();
    }

    protected calculateUsabilityBadness() {
        if (!this._accountsDataItem.usable) {
            return this.createUnusableAccountsBadness();
        } else {
            return Badness.notBad;
        }
    }

    private handleAccountsBadnessChangedEvent() {
        if (!this._accountsDataItem.usable) {
            const badness = this.createUnusableAccountsBadness();
            this.setUnusable(badness);
        }
    }

    private handleAccountsListChangeEvent(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        this.processAccountsListChange(listChangeTypeId, index, count);
    }

    private processAccountsListChange(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable: {
                const unusablebadness = this.createUnusableAccountsBadness();
                this.setUnusable(unusablebadness);
                break;
            }
            case UsableListChangeTypeId.PreUsableClear: {
                this.processAccountsPreUsableClear();
                break;
            }
            case UsableListChangeTypeId.PreUsableAdd: {
                this.processAccountsPreUsableAdd();
                break;
            }
            case UsableListChangeTypeId.Usable: {
                this.processAccountsUsable();
                break;
            }
            case UsableListChangeTypeId.Insert: {
                this.processAccountsInserted(index, count);
                break;
            }
            case UsableListChangeTypeId.BeforeReplace:
                throw new AssertInternalError('ABALCDIPALCBR30911', this.definition.description);
            case UsableListChangeTypeId.AfterReplace:
                throw new AssertInternalError('ABALCDIPALCAR30911', this.definition.description);
            case UsableListChangeTypeId.BeforeMove:
                throw new AssertInternalError('ABALCDIPALCBM30911', this.definition.description);
            case UsableListChangeTypeId.AfterMove:
                throw new AssertInternalError('ABALCDIPALCAM30911', this.definition.description);
            case UsableListChangeTypeId.Remove:
                throw new AssertInternalError('ABADRDIPALCR30911', this.definition.description);
            case UsableListChangeTypeId.Clear: {
                this.processAccountsClear();
                break;
            }
            default:
                throw new UnreachableCaseError('ABADRDIPALCD11103888', listChangeTypeId);
        }
    }

    private createUnusableAccountsBadness() {
        const accountsBadness = this._accountsDataItem.badness;
        const reasonExtra = Badness.generateText(accountsBadness);
        if (Badness.isError(accountsBadness)) {
            return {
                reasonId: Badness.ReasonId.BrokerageAccountsError,
                reasonExtra,
            };
        } else {
            return {
                reasonId: Badness.ReasonId.BrokerageAccountsWaiting,
                reasonExtra,
            };
        }
    }

    protected abstract processAccountsPreUsableClear(): void;
    protected abstract processAccountsPreUsableAdd(): void;
    protected abstract processAccountsClear(): void;
    protected abstract processAccountsInserted(index: Integer, count: Integer): void;
    protected abstract processAccountsUsable(): void;
}
