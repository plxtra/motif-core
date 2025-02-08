import { ColorSchemeModule } from './color-scheme';
import { ColorSchemePreset } from './color-scheme-preset';
import { SettingsGroupModule } from './settings-group';

/** @internal */
export namespace SettingsStaticInitialise {
    export function initialise() {
        SettingsGroupModule.initialiseStatic();
        ColorSchemeModule.initialiseStatic();
        ColorSchemePreset.initialiseStatic();
    }
}
