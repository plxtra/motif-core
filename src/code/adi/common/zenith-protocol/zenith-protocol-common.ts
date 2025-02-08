export namespace ZenithProtocolCommon {
    export const environmentOpenChar = '[';
    export const environmentCloseChar = ']';
    export const codeMarketSeparator = '.';
    export const marketDelimiter = ':';

    export const enum KnownExchange {
        Asx = 'ASX',
        Cxa = 'CXA',
        Nsx = 'NSX',
        Nzx = 'NZX',
        Myx = 'MYX',
        Calastone = 'Calastone',
        Ptx = 'PTX',
        Fnsx = 'FNSX',
        Fpsx = 'FPSX',
        Cfx = 'CFMX',
        Dax = 'DAXM',
        AsxCxa = 'ASX+CXA',
    }

    export type UserMetadata = Record<string, string | undefined>;

    export namespace Symbol {
        export interface Alternates {
            [key: string]: string | undefined;
            Ticker?: string;
            ISIN?: string;
            Base?: string;
            GICS?: string;
            RIC?: string;
            Short?: string;
            Long?: string;
            UID?: string;
        }

        export const enum KnownAlternateKey {
            Ticker = 'Ticker',
            ISIN = 'ISIN',
            Base = 'Base',
            GICS = 'GICS',
            RIC = 'RIC',
            Short = 'Short',
            Long = 'Long',
            UID = 'UID',
        }

        export type Attributes = Record<string, string | undefined>;

        export const enum KnownAttributeKey {
            Category = 'Category',
            Class = 'Class',
            Delivery = 'Delivery',
            Sector = 'Sector',
            Short = 'Short',
            ShortSuspended = 'ShortSuspended',
            SubSector = 'SubSector',
            MaxRss = 'MaxRSS',
        }
    }

    // This data is returned by QueryMethod.  For Push.Web type methods, the application should pass it to browser's Notification API
    export interface NotificationDistributionMethodMetadata {
        readonly userVisibleOnly: boolean;
        readonly applicationServerKey: string;
    }

    // The Settings data is included in ChannelParameters.  See below how this is generated
    // Probably a better name for this would be NotificationDistributionMethodSettings as there will probably be a descendant for each NotificationDistributionMethodId however
    // the existing name lines up with Zenith documentation
    export interface NotificationChannelSettings {

    }

    // The WebSettings is used for Push.Web type notifications.  It should be derived from browser's Notification API after passing it the DistributionMethodMetadata.
    // It needs to support the interface below.
    export interface WebNotificationChannelSettings extends NotificationChannelSettings {
        readonly endpoint: string;
        readonly expirationTime?: number; // seconds
        readonly keys?: WebNotificationChannelSettings.PushKeys;
    }

    export namespace WebNotificationChannelSettings {
        export interface PushKeys {
            readonly p256dh: string;
            readonly auth: string;
        }
    }
}
