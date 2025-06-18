import { Integer, MultiEvent, UnreachableCaseError } from '@pbkware/js-utils';
import { BrokerageAccount } from '../../../adi';
import { Correctness } from '../../../sys';
import { BrokerageAccountTableFieldSourceDefinition } from '../field-source/definition/internal-api';
import {
    CorrectnessTableValue,
    CurrencyIdCorrectnessTableValue,
    StringCorrectnessTableValue,
    TableValue
} from '../value/internal-api';
import { TableValueSource } from './table-value-source';

export class BrokerageAccountTableValueSource extends TableValueSource {
    private _accountChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _accountCorrectnessChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(firstFieldIndexOffset: Integer, private readonly _account: BrokerageAccount) {
        super(firstFieldIndexOffset);
    }

    activate(): TableValue[] {
        this._accountChangeEventSubscriptionId = this._account.subscribeChangeEvent(
            (accountChanges) => { this.handleAccountChangeEvent(accountChanges); }
        );
        this._accountCorrectnessChangedEventSubscriptionId = this._account.subscribeCorrectnessChangedEvent(
            () => { this.handleAccountCorrectnessChangedEvent(); }
        );

        this.initialiseBeenIncubated(Correctness.idIsIncubated(this._account.correctnessId));

        return this.getAllValues();
    }

    deactivate() {
        if (this._accountChangeEventSubscriptionId !== undefined) {
            this._account.unsubscribeChangeEvent(this._accountChangeEventSubscriptionId);
            this._accountChangeEventSubscriptionId = undefined;
        }
        if (this._accountCorrectnessChangedEventSubscriptionId !== undefined) {
            this._account.unsubscribeCorrectnessChangedEvent(this._accountCorrectnessChangedEventSubscriptionId);
            this._accountCorrectnessChangedEventSubscriptionId = undefined;
        }
    }

    getAllValues(): TableValue[] {
        const fieldCount = BrokerageAccountTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);
        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = BrokerageAccountTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getfieldCount(): Integer {
        return BrokerageAccountTableFieldSourceDefinition.Field.count;
    }

    private handleAccountChangeEvent(accountValueChanges: BrokerageAccount.ValueChange[]) {
        const changedFieldCount = accountValueChanges.length;
        const valueChanges = new Array<TableValueSource.ValueChange>(changedFieldCount);
        let foundCount = 0;
        for (let i = 0; i < accountValueChanges.length; i++) {
            const { fieldId, recentChangeTypeId } = accountValueChanges[i];
            const fieldIndex = BrokerageAccountTableFieldSourceDefinition.Field.indexOfId(fieldId);
            if (fieldIndex >= 0) {
                const newValue = this.createTableValue(fieldIndex);
                this.loadValue(fieldId, newValue);
                valueChanges[foundCount++] = { fieldIndex, newValue, recentChangeTypeId };
            }
        }
        if (foundCount < changedFieldCount) {
            valueChanges.length = foundCount;
        }
        this.notifyValueChangesEvent(valueChanges);
    }

    private handleAccountCorrectnessChangedEvent() {
        const allValues = this.getAllValues();
        this.processDataCorrectnessChanged(allValues, Correctness.idIsIncubated(this._account.correctnessId));
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = BrokerageAccountTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: BrokerageAccount.FieldId, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this._account.correctnessId;

        switch (id) {
            case BrokerageAccount.FieldId.IdDisplay:
                (value as StringCorrectnessTableValue).data = this._account.id.display;
                break;
            case BrokerageAccount.FieldId.EnvironmentZenithCode:
                (value as StringCorrectnessTableValue).data = this._account.id.environment.display;
                break;
            case BrokerageAccount.FieldId.Name:
                (value as StringCorrectnessTableValue).data = this._account.name;
                break;
            case BrokerageAccount.FieldId.Currency:
                (value as CurrencyIdCorrectnessTableValue).data = this._account.currencyId;
                break;
            case BrokerageAccount.FieldId.BrokerCode:
                (value as StringCorrectnessTableValue).data = this._account.brokerCode;
                break;
            case BrokerageAccount.FieldId.BranchCode:
                (value as StringCorrectnessTableValue).data = this._account.branchCode;
                break;
            case BrokerageAccount.FieldId.AdvisorCode:
                (value as StringCorrectnessTableValue).data = this._account.advisorCode;
                break;
            default:
                throw new UnreachableCaseError('BATVSLV9473', id);
        }
    }
}
