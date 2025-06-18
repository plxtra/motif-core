import { CorrectnessState, MultiEvent } from '@pbkware/js-utils';
import { RevSourcedFieldCustomHeadings, RevTableRecordSource } from 'revgrid';
import { TextFormattableValue, TextFormatter } from '../../../services';
import { Badness } from '../../../sys';
import { TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory } from '../field-source/internal-api';
import { TableRecordSourceDefinition } from './definition/internal-api';

export abstract class TableRecordSource extends RevTableRecordSource<
    Badness,
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {
    private _correctnessStateUsableChangedSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessState: CorrectnessState<Badness>,
        definition: TableRecordSourceDefinition,
        allowedFieldSourceDefinitionTypeIds: readonly TableFieldSourceDefinition.TypeId[],
    ) {
        super(textFormatter, customHeadings, tableFieldSourceDefinitionCachingFactory, correctnessState, definition, allowedFieldSourceDefinitionTypeIds);
        this._correctnessStateUsableChangedSubscriptionId = this._correctnessState.subscribeUsableChangedEvent(() => this.processUsableChanged());
    }

    // get activated(): boolean { return this._opened; }

    override finalise() {
        this._correctnessState.unsubscribeUsableChangedEvent(this._correctnessStateUsableChangedSubscriptionId);
        this._correctnessStateUsableChangedSubscriptionId = undefined;
    }

    protected processUsableChanged() {
        // descendants can override
    }
}
