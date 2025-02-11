import { Integer } from '@xilytix/sysutils';
import { TypedKeyValueScalarSettingsGroup } from './typed-key-value-scalar-settings-group';
import { TypedKeyValueSettings } from './typed-key-value-settings';

export class MasterSettings extends TypedKeyValueScalarSettingsGroup {
    private _operatorDefaultExchangeEnvironmentSpecific: boolean = MasterSettings.Default.operatorDefaultExchangeEnvironmentSpecific;
    private _test: boolean = MasterSettings.Default.test;

    private _infosObject: MasterSettings.InfosObject = {
        OperatorDefaultExchangeEnvironmentSpecific: {
            id: MasterSettings.Id.OperatorDefaultExchangeEnvironmentSpecific,
            name: 'OperatorDefaultExchangeEnvironmentSpecific',
            operator: false,
            defaulter: () => TypedKeyValueSettings.formatBoolean(MasterSettings.Default.operatorDefaultExchangeEnvironmentSpecific),
            getter: () => TypedKeyValueSettings.formatBoolean(this._operatorDefaultExchangeEnvironmentSpecific),
            pusher: (value: TypedKeyValueSettings.PushValue) => {
                this._operatorDefaultExchangeEnvironmentSpecific = TypedKeyValueSettings.parseBoolean(value);
            }
        },
        Test: {
            id: MasterSettings.Id.Test,
            name: 'Test',
            operator: false,
            defaulter: () => TypedKeyValueSettings.formatBoolean(MasterSettings.Default.test),
            getter: () => TypedKeyValueSettings.formatBoolean(this._test),
            pusher: (value: TypedKeyValueSettings.PushValue) => {
                this._test = TypedKeyValueSettings.parseBoolean(value);
            }
        },
    } as const;

    private readonly _infos = Object.values(this._infosObject);
    // eslint-disable-next-line @typescript-eslint/member-ordering
    protected readonly idCount = this._infos.length;

    constructor() {
        super(MasterSettings.groupName);
    }

    get operatorDefaultExchangeEnvironmentSpecific() { return this._operatorDefaultExchangeEnvironmentSpecific; }
    set operatorDefaultExchangeEnvironmentSpecific(value: boolean) {
        this._operatorDefaultExchangeEnvironmentSpecific = value;
        this.notifySettingChanged(MasterSettings.Id.OperatorDefaultExchangeEnvironmentSpecific);
    }

    get test() { return this._test; }
    set test(value: boolean) {
        this._test = value;
        this.notifySettingChanged(MasterSettings.Id.Test);
    }

    protected getInfo(idx: Integer) {
        return this._infos[idx];
    }
}

export namespace MasterSettings {
    export const groupName = 'master';

    export const enum Id {
        OperatorDefaultExchangeEnvironmentSpecific,
        Test,
    }

    export type InfosObject = { [id in keyof typeof Id]: TypedKeyValueSettings.Info };

    export namespace Default {
        export const operatorDefaultExchangeEnvironmentSpecific = false;
        export const test = false;
    }

    // export namespace ApplicationUserEnvironmentSelector {
    //     export const enum SelectorId {
    //         // eslint-disable-next-line @typescript-eslint/no-shadow
    //         Default,
    //         DataEnvironment,
    //         DataEnvironment_Sample,
    //         DataEnvironment_Demo,
    //         DataEnvironment_DelayedProduction,
    //         DataEnvironment_Production,
    //         Test,
    //     }

    //     export const enum SettingValue {
    //         // eslint-disable-next-line @typescript-eslint/no-shadow
    //         Default = 'default',
    //         DataEnvironment = 'exchangeEnvironment',
    //         DataEnvironment_Sample = 'exchangeEnvironment_Sample',
    //         DataEnvironment_Demo = 'exchangeEnvironment_Demo',
    //         DataEnvironment_DelayedProduction = 'exchangeEnvironment_Delayed',
    //         DataEnvironment_Production = 'exchangeEnvironment_Production',
    //         Test = 'test',
    //     }

    //     export const defaultId = SelectorId.Default;

    //     interface Info {
    //         readonly id: SelectorId;
    //         readonly settingValue: string;
    //         readonly displayId: StringId;
    //         readonly titleId: StringId;
    //     }

    //     type SelectorInfosObject = { [id in keyof typeof SelectorId]: Info };

    //     const selectorInfosObject: SelectorInfosObject = {
    //         Default: {
    //             id: SelectorId.Default,
    //             settingValue: SettingValue.Default,
    //             displayId: StringId.ApplicationEnvironmentSelectorDisplay_Default,
    //             titleId: StringId.ApplicationEnvironmentSelectorTitle_Default,
    //         },
    //         DataEnvironment: {
    //             id: SelectorId.DataEnvironment,
    //             settingValue: SettingValue.DataEnvironment,
    //             displayId: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment,
    //             titleId: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment,
    //         },
    //         DataEnvironment_Sample: {
    //             id: SelectorId.DataEnvironment_Sample,
    //             settingValue: SettingValue.DataEnvironment_Sample,
    //             displayId: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment_Sample,
    //             titleId: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment_Sample,
    //         },
    //         DataEnvironment_Demo: {
    //             id: SelectorId.DataEnvironment_Demo,
    //             settingValue: SettingValue.DataEnvironment_Demo,
    //             displayId: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment_Demo,
    //             titleId: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment_Demo,
    //         },
    //         DataEnvironment_DelayedProduction: {
    //             id: SelectorId.DataEnvironment_DelayedProduction,
    //             settingValue: SettingValue.DataEnvironment_DelayedProduction,
    //             displayId: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment_Delayed,
    //             titleId: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment_Delayed,
    //         },
    //         DataEnvironment_Production: {
    //             id: SelectorId.DataEnvironment_Production,
    //             settingValue: SettingValue.DataEnvironment_Production,
    //             displayId: StringId.ApplicationEnvironmentSelectorDisplay_DataEnvironment_Production,
    //             titleId: StringId.ApplicationEnvironmentSelectorTitle_DataEnvironment_Production,
    //         },
    //         Test: {
    //             id: SelectorId.Test,
    //             settingValue: SettingValue.Test,
    //             displayId: StringId.ApplicationEnvironmentSelectorDisplay_Test,
    //             titleId: StringId.ApplicationEnvironmentSelectorTitle_Test,
    //         },
    //     } as const;

    //     export const idCount = Object.keys(selectorInfosObject).length;
    //     const infos = Object.values(selectorInfosObject);

    //     export function initialise() {
    //         const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as SelectorId);
    //         if (outOfOrderIdx >= 0) {
    //             throw new EnumInfoOutOfOrderError('ApplicationEnvironmentSelector', outOfOrderIdx, Strings[infos[outOfOrderIdx].displayId]);
    //         }
    //     }

    //     export function idToSettingValue(id: SelectorId) {
    //         return infos[id].settingValue;
    //     }

    //     export function trySettingValueToId(value: string) {
    //         const foundInfo = infos.find((info) => info.settingValue === value);
    //         return foundInfo?.id;
    //     }

    //     export function idToDisplayId(id: SelectorId) {
    //         return infos[id].displayId;
    //     }

    //     export function idToDisplay(id: SelectorId) {
    //         return Strings[idToDisplayId(id)];
    //     }

    //     export function idToTitleId(id: SelectorId) {
    //         return infos[id].titleId;
    //     }

    //     export function idToDescription(id: SelectorId) {
    //         return Strings[idToTitleId(id)];
    //     }
    // }
}

// export namespace MasterSettingsModule {
//     export function initialiseStatic() {
//         MasterSettings.ApplicationUserEnvironmentSelector.initialise();
//     }
// }
