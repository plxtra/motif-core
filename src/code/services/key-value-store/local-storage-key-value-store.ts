import { Ok, Result } from '@pbkware/js-utils';
import { KeyValueStore } from './key-value-store';

export class LocalStorageKeyValueStore implements KeyValueStore {

    public getItem(key: string, serviceOperator: string | undefined): Promise<Result<string | undefined>> {
        const resolvedKey = this.generateResolvedKey(key, serviceOperator);
        const item = window.localStorage.getItem(resolvedKey);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const value = (item === null)
            ? undefined
            : item;
        return Promise.resolve(new Ok(value));
    }

    public setItem(key: string, value: string, serviceOperator: string | undefined): Promise<Result<void>> {
        const resolvedKey = this.generateResolvedKey(key, serviceOperator);
        window.localStorage.setItem(resolvedKey, value);
        return Promise.resolve(new Ok(undefined));
    }

    public removeItem(key: string, serviceOperator: string | undefined): Promise<Result<void>> {
        const resolvedKey = this.generateResolvedKey(key, serviceOperator);
        window.localStorage.removeItem(resolvedKey);
        return Promise.resolve(new Ok(undefined));
    }

    private generateResolvedKey(key: string, serviceOperator: string | undefined) {
        if (serviceOperator === undefined) {
            return key;
        } else {
            return serviceOperator + '|' + key;
        }
    }

}
