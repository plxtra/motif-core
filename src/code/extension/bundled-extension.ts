import { ExtensionInfo } from './extension-info';

export interface BundledExtension {
    readonly info: ExtensionInfo;
    readonly install: boolean;
}
