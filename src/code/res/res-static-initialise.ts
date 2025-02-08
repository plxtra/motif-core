import { I18nStrings } from './i18n-strings';

/** @internal */
export namespace ResStaticInitialise {
    export function initialise() {
        I18nStrings.initialiseStatic();
    }
}
