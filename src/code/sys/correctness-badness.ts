// This is code from DataItem.  Eventually migrate DataItem, TableRecordDefinitionList, Table and SequenceHistory to descend from this.

import { AssertInternalError, CorrectnessState, MultiEvent } from '@pbkware/js-utils';
import { Badness } from './badness';
import { CorrectnessId } from './correctness';
import { CorrectnessRecord } from './correctness-record';

export class CorrectnessBadness implements CorrectnessRecord, CorrectnessState<Badness> {
    private _badness = Badness.createCopy(Badness.inactive);
    private _correctnessId = CorrectnessId.Suspect;
    private _setGoodBadTransactionId = 0;
    private _good = false;
    private _usable = false;
    private _error = false;
    private _usableChangedMultiEvent = new MultiEvent<CorrectnessBadness.UsableChangedEventHandler>();
    private _correctnessChangedMultiEvent = new MultiEvent<CorrectnessBadness.CorrectnessChangedEventHandler>();
    private _badnessChangedMultiEvent = new MultiEvent<CorrectnessBadness.BadnessChangedEventHandler>();

    get badness() { return this._badness; }
    get correctnessId() { return this._correctnessId; }
    get good() { return this._good; }
    get usable() { return this._usable; }
    get error() { return this._error; }
    get errorText() { return Badness.generateText(this._badness); }
    get incubated() { return this._correctnessId !== CorrectnessId.Suspect; }

    setBadness(badness: Badness) {
        if (Badness.isGood(badness)) {
            this.setGood();
        } else {
            const newReasonId = badness.reasonId;
            const newReasonExtra = badness.reasonExtra;
            if (newReasonId !== this._badness.reasonId || newReasonExtra !== this.badness.reasonExtra) {
                const oldUsable = this._usable;
                const oldCorrectnessId = this._correctnessId;
                this._correctnessId = Badness.Reason.idToCorrectnessId(newReasonId);
                this._good = false;
                this._usable = this._correctnessId === CorrectnessId.Usable; // Cannot be Good
                this._error = this._correctnessId === CorrectnessId.Error;
                this._badness = {
                    reasonId: newReasonId,
                    reasonExtra: newReasonExtra,
                } as const;
                const transactionId = ++this._setGoodBadTransactionId;
                if (oldUsable !== this._usable) {
                    this.processUsableChanged();
                }
                if (transactionId === this._setGoodBadTransactionId) {
                    this.processBadnessChanged();

                    if (this._correctnessId !== oldCorrectnessId) {
                        this.processCorrectnessChanged();
                    }
                }
            }
        }
    }

    setUsable(badness: Badness) {
        if (Badness.isUnusable(badness)) {
            throw new AssertInternalError('CBSU129484'); // must always be usable
        } else {
            this.setBadness(badness);
        }
    }

    setUnusable(badness: Badness) {
        if (Badness.isUsable(badness)) {
            throw new AssertInternalError('CBSNU29484'); // must always be unusable
        } else {
            this.setBadness(badness);
        }
    }

    checkSetUnusable(badness: Badness) {
        if (badness.reasonId !== Badness.ReasonId.NotBad) {
            this.setBadness(badness);
        }
    }

    subscribeUsableChangedEvent(handler: CorrectnessBadness.UsableChangedEventHandler) {
        return this._usableChangedMultiEvent.subscribe(handler);
    }

    unsubscribeUsableChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._usableChangedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeCorrectnessChangedEvent(handler: CorrectnessBadness.CorrectnessChangedEventHandler) {
        return this._correctnessChangedMultiEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._correctnessChangedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeBadnessChangedEvent(handler: CorrectnessBadness.BadnessChangedEventHandler) {
        return this._badnessChangedMultiEvent.subscribe(handler);
    }

    unsubscribeBadnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._badnessChangedMultiEvent.unsubscribe(subscriptionId);
    }

    protected processUsableChanged() {
        this.notifyUsableChanged();
    }

    protected processBadnessChanged() {
        this.notifyBadnessChanged();
    }

    protected processCorrectnessChanged() {
        this.notifyCorrectnessChanged();
    }

    /**
     * Descendants should call when they want to try to transition to a Usable state
     * Used by DataItem
     */
    protected trySetUsable() {
        const badness = this.calculateUsabilityBadness();
        this.setBadness(badness);
    }

    // DataItem makes this abstract
    protected calculateUsabilityBadness(): Badness {
        return Badness.createCopy(Badness.inactive);
    }

    // setBadness can also make an object Good
    private setGood() {
        if (!this._good) {
            this._correctnessId = CorrectnessId.Good;
            const oldUsable = this._usable;
            this._good = true;
            this._usable = true;
            this._error = false;
            this._badness = {
                reasonId: Badness.ReasonId.NotBad,
                reasonExtra: '',
            } as const;
            const transactionId = ++this._setGoodBadTransactionId;
            if (!oldUsable) {
                this.processUsableChanged();
            }
            if (transactionId === this._setGoodBadTransactionId) {
                this.processBadnessChanged();
                this.processCorrectnessChanged();
            }
        }
    }

    private notifyBadnessChanged(): void {
        const handlers = this._badnessChangedMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i]();
        }
    }

    private notifyCorrectnessChanged(): void {
        const handlers = this._correctnessChangedMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i]();
        }
    }

    private notifyUsableChanged(): void {
        const handlers = this._usableChangedMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i]();
        }
    }
}

export namespace CorrectnessBadness {
    export type UsableChangedEventHandler = (this: void) => void;
    export type CorrectnessChangedEventHandler = (this: void) => void;
    export type BadnessChangedEventHandler = (this: void) => void;
}
