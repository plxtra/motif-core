import { Result } from '@xilytix/sysutils';

/** @public */
export interface KeyValueStore {
    getItem(key: string, keyFolderPath: string): Promise<Result<string | undefined>>;
    setItem(key: string, value: string, keyFolderPath: string): Promise<Result<void>>;
    removeItem(key: string, keyFolderPath: string): Promise<Result<void>>;
}

/** @public */
export namespace KeyValueStore {
    export const enum Key {
        MasterSettings = 'masterSettings',
        Settings = 'settings',
        Extensions = 'extensions',
        Layout = 'layout',
        LoadedExtensions = 'loadedExtensions',
    }
}
