import { AssertInternalError, CommaText, Integer, MultiEvent, UnreachableCaseError } from '@xilytix/sysutils';
import { Scan } from '../../../scan/internal-api';
import { SymbolsService } from '../../../services/symbols-service';
import { Correctness } from '../../../sys/internal-api';
import { ScanTableFieldSourceDefinition } from '../field-source/internal-api';
import {
    ActiveFaultedStatusIdCorrectnessTableValue,
    BooleanCorrectnessTableValue,
    CorrectnessTableValue,
    DateTimeCorrectnessTableValue,
    EnabledCorrectnessTableValue, IntegerCorrectnessTableValue,
    ScanTargetTypeIdCorrectnessTableValue,
    StringArrayCorrectnessTableValue,
    StringCorrectnessTableValue,
    TableValue
} from '../value/internal-api';
import { CorrectnessTableValueSource } from './correctness-table-value-source';
import { TableValueSource } from './table-value-source';

export class ScanTableValueSource extends CorrectnessTableValueSource<Scan> {
    private _correctnessChangedEventSubscriptionId: MultiEvent.SubscriptionId;
    private _fieldsChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        private readonly _symbolsService: SymbolsService,
        firstFieldIndexOffset: Integer,
        private _scan: Scan
    ) {
        super(firstFieldIndexOffset);
    }

    override activate(): TableValue[] {
        this._fieldsChangedEventSubscriptionId = this._scan.subscribeValuesChangedEvent(
            (valueChanges) => { this.handleValuesChangedEvent(valueChanges); }
        );
        this._correctnessChangedEventSubscriptionId = this._scan.subscribeCorrectnessChangedEvent(
            () => { this.handleCorrectnessChangedEvent(); }
        );

        this.initialiseBeenIncubated(Correctness.idIsIncubated(this._scan.correctnessId));

        return this.getAllValues();
    }

    override deactivate() {
        if (this._fieldsChangedEventSubscriptionId !== undefined) {
            this._scan.unsubscribeValuesChangedEvent(this._fieldsChangedEventSubscriptionId);
            this._fieldsChangedEventSubscriptionId = undefined;
        }
        if (this._correctnessChangedEventSubscriptionId !== undefined) {
            this._scan.unsubscribeCorrectnessChangedEvent(this._correctnessChangedEventSubscriptionId);
            this._correctnessChangedEventSubscriptionId = undefined;
        }
    }

    getAllValues(): TableValue[] {
        const fieldCount = ScanTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);
        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = ScanTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected override getRecord(): Scan {
        return this._scan;
    }

    protected getfieldCount(): Integer {
        return ScanTableFieldSourceDefinition.Field.count;
    }

    private handleCorrectnessChangedEvent() {
        const allValues = this.getAllValues();
        this.processDataCorrectnessChanged(allValues, Correctness.idIsIncubated(this._scan.correctnessId));
    }

    private handleValuesChangedEvent(scanValueChanges: Scan.ValueChange[]) {
        const changeCount = scanValueChanges.length;
        const valueChanges = new Array<TableValueSource.ValueChange>(changeCount);
        let foundCount = 0;
        for (let i = 0; i < scanValueChanges.length; i++) {
            const { fieldId, recentChangeTypeId } = scanValueChanges[i];
            const fieldIndex = ScanTableFieldSourceDefinition.Field.indexOfId(fieldId);
            if (fieldIndex >= 0) {
                const newValue = this.createTableValue(fieldIndex);
                this.loadValue(fieldId, newValue);
                valueChanges[foundCount++] = { fieldIndex, newValue, recentChangeTypeId };
            }
        }
        if (foundCount < changeCount) {
            valueChanges.length = foundCount;
        }
        this.notifyValueChangesEvent(valueChanges);
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = ScanTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: Scan.FieldId, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this._scan.correctnessId;

        switch (id) {
            case Scan.FieldId.Id: {
                (value as StringCorrectnessTableValue).data = this._scan.id;
                break;
            }
            case Scan.FieldId.Readonly: {
                (value as BooleanCorrectnessTableValue).data = this._scan.readonly;
                break;
            }
            case Scan.FieldId.Index: {
                // (value as IntegerCorrectnessTableValue).data = this._scan.index;
                throw new AssertInternalError('STVSLVZI34345');
                break;
            }
            case Scan.FieldId.StatusId: {
                (value as ActiveFaultedStatusIdCorrectnessTableValue).data = this._scan.statusId;
                break;
            }
            case Scan.FieldId.Enabled: {
                (value as EnabledCorrectnessTableValue).data = this._scan.enabled;
                break;
            }
            case Scan.FieldId.Name: {
                (value as StringCorrectnessTableValue).data = this._scan.name;
                break;
            }
            case Scan.FieldId.Description: {
                (value as StringCorrectnessTableValue).data = this._scan.description;
                break;
            }
            case Scan.FieldId.TargetTypeId: {
                (value as ScanTargetTypeIdCorrectnessTableValue).data = this._scan.targetTypeId;
                break;
            }
            case Scan.FieldId.TargetMarkets: {
                let display: string[] | undefined;
                const targetMarkets = this._scan.targetMarkets;
                if (targetMarkets !== undefined) {
                    display = targetMarkets.map(market => market.display);
                }
                (value as StringArrayCorrectnessTableValue).data = display;
                break;
            }
            case Scan.FieldId.TargetDataIvemIds: {
                let display: string | undefined;
                const targetDataIvemIds = this._scan.targetDataIvemIds;
                if (targetDataIvemIds === undefined) {
                    display = undefined;
                } else {
                    const count = targetDataIvemIds.length;
                    const dataIvemIdDisplays = new Array<string>(count);
                    for (let i = 0; i < count; i++) {
                        dataIvemIdDisplays[i] = this._symbolsService.dataIvemIdToDisplay(targetDataIvemIds[i]);
                    }
                    display = CommaText.fromStringArray(dataIvemIdDisplays);
                }
                (value as StringCorrectnessTableValue).data = display;
                break;
            }
            case Scan.FieldId.MaxMatchCount: {
                (value as IntegerCorrectnessTableValue).data = this._scan.maxMatchCount;
                break;
            }
            case Scan.FieldId.ZenithCriteria: {
                throw new AssertInternalError('STVSLVZC34345');
            }
            case Scan.FieldId.ZenithRank: {
                throw new AssertInternalError('STVSLVZR34345');
            }
            case Scan.FieldId.AttachedNotificationChannels: {
                throw new AssertInternalError('STVSLVZANC34345');
            }
            case Scan.FieldId.ZenithCriteriaSource: {
                throw new AssertInternalError('STVSLVZCS34345');
            }
            case Scan.FieldId.ZenithRankSource: {
                throw new AssertInternalError('STVSLVZRS34345');
            }
            case Scan.FieldId.SymbolListEnabled: {
                (value as EnabledCorrectnessTableValue).data = this._scan.symbolListEnabled;
                break;
            }
            case Scan.FieldId.Version: {
                (value as StringCorrectnessTableValue).data = this._scan.version;
                break;
            }
            case Scan.FieldId.LastSavedTime: {
                (value as DateTimeCorrectnessTableValue).data = this._scan.lastSavedTime;
                break;
            }
            case Scan.FieldId.LastEditSessionId: {
                throw new AssertInternalError('STVSLVZLS34345');
                break;
            }
            default:
                throw new UnreachableCaseError('STVSLV9112473', id);
        }
    }
}
