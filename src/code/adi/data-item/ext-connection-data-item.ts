import { DataItem } from './data-item';

export abstract class ExtConnectionDataItem extends DataItem {
    get Connected(): boolean { return this.getConnected(); }

    protected abstract getConnected(): boolean;
}
