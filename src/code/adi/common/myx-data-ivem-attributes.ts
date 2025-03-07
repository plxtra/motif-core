import {
    AssertInternalError,
    EnumInfoOutOfOrderError,
    Integer,
    isUndefinableArrayEqualUniquely
} from '@pbkware/js-utils';
import { StringId, Strings } from '../../res/internal-api';
import {
    FieldDataTypeId,
} from "../../sys/internal-api";
import { DataIvemAttributes } from './data-ivem-attributes';
import { ZenithProtocolCommon } from './zenith-protocol/internal-api';

export class MyxDataIvemAttributes extends DataIvemAttributes {
    category: Integer | undefined;
    marketClassificationId: MyxDataIvemAttributes.MarketClassificationId | undefined;
    deliveryBasisId: MyxDataIvemAttributes.DeliveryBasisId | undefined;
    maxRss: number | undefined;
    sector: Integer | undefined;
    short: readonly MyxDataIvemAttributes.ShortSellTypeId[] | undefined;
    shortSuspended: readonly MyxDataIvemAttributes.ShortSellTypeId[] | undefined;
    subSector: Integer | undefined;

    constructor() {
        super(ZenithProtocolCommon.KnownExchange.Myx);
    }

    override isEqualTo(other: DataIvemAttributes): boolean {
        if (!MyxDataIvemAttributes.isMyx(other)) {
            throw new AssertInternalError('MLIAIET99801', other.zenithExchangeCode);
        } else {
            let result = super.isEqualTo(other);
            if (result) {
                result =
                    this.category === other.category &&
                    this.marketClassificationId === other.marketClassificationId &&
                    this.deliveryBasisId === other.deliveryBasisId &&
                    this.maxRss === other.maxRss &&
                    this.sector === other.sector &&
                    isUndefinableArrayEqualUniquely(this.short, other.short) &&
                    this.shortSuspended === other.shortSuspended &&
                    this.subSector === other.subSector;
            }

            return result;
        }
    }

}

export namespace MyxDataIvemAttributes {
    export const enum MarketClassificationId {
        Main,
        Ace,
        Etf,
        Strw,
        Bond,
        Leap,
    }

    export const enum ShortSellTypeId {
        RegulatedShortSelling,
        ProprietaryDayTrading,
        IntraDayShortSelling,
        ProprietaryShortSelling,
    }

    // export const enum CategoryId {
    //     Foreign,
    //     Sharia,
    // }

    export const enum DeliveryBasisId {
        BuyingInT0,
        DesignatedBasisT1,
        ReadyBasisT2,
        ImmediateBasisT1,
    }

    export function isMyx(attributes: DataIvemAttributes): attributes is MyxDataIvemAttributes {
        return attributes.zenithExchangeCode === ZenithProtocolCommon.KnownExchange.Myx as string;
    }

    export namespace Field {
        export const enum Id {
            Category,
            MarketClassification,
            DeliveryBasis,
            MaxRSS,
            Sector,
            Short,
            ShortSuspended,
            SubSector,
        }

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof Id]: Info };

        const infosObject: InfosObject = {
            Category: {
                id: Id.Category,
                name: 'Category',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.MyxDataIvemAttributesDisplay_Category,
                headingId: StringId.MyxDataIvemAttributesHeading_Category,
            },
            MarketClassification: {
                id: Id.MarketClassification,
                name: 'MarketClassification',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.MyxDataIvemAttributesDisplay_MarketClassification,
                headingId: StringId.MyxDataIvemAttributesHeading_MarketClassification,
            },
            DeliveryBasis: {
                id: Id.DeliveryBasis,
                name: 'DeliveryBasis',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.MyxDataIvemAttributesDisplay_DeliveryBasis,
                headingId: StringId.MyxDataIvemAttributesHeading_DeliveryBasis,
            },
            MaxRSS: {
                id: Id.MaxRSS,
                name: 'MaxRSS',
                dataTypeId: FieldDataTypeId.Number,
                displayId: StringId.MyxDataIvemAttributesDisplay_MaxRSS,
                headingId: StringId.MyxDataIvemAttributesHeading_MaxRSS,
            },
            Sector: {
                id: Id.Sector,
                name: 'Sector',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.MyxDataIvemAttributesDisplay_Sector,
                headingId: StringId.MyxDataIvemAttributesHeading_Sector,
            },
            Short: {
                id: Id.Short,
                name: 'Short',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.MyxDataIvemAttributesDisplay_Short,
                headingId: StringId.MyxDataIvemAttributesHeading_Short,
            },
            ShortSuspended: {
                id: Id.ShortSuspended,
                name: 'ShortSuspended',
                dataTypeId: FieldDataTypeId.Enumeration,
                displayId: StringId.MyxDataIvemAttributesDisplay_ShortSuspended,
                headingId: StringId.MyxDataIvemAttributesHeading_ShortSuspended,
            },
            SubSector: {
                id: Id.SubSector,
                name: 'SubSector',
                dataTypeId: FieldDataTypeId.Integer,
                displayId: StringId.MyxDataIvemAttributesDisplay_SubSector,
                headingId: StringId.MyxDataIvemAttributesHeading_SubSector,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export const allNames = new Array<string>(idCount);

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (infos[id].id !== id as Id) {
                    throw new EnumInfoOutOfOrderError('MyxDataIvemAttribute.Field', id, infos[id].name);
                } else {
                    allNames[id] = idToName(id);
                }
            }
        }

        export function idToName(id: Id): string {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: Id) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToHeadingId(id: Id) {
            return infos[id].headingId;
        }

        export function idToHeading(id: Id) {
            return Strings[idToHeadingId(id)];
        }
    }

    export namespace MarketClassification {
        export type Id = MarketClassificationId;

        interface Info {
            readonly id: Id;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof MarketClassificationId]: Info };

        const infosObject: InfosObject = {
            Main: {
                id: MarketClassificationId.Main,
                displayId: StringId.MyxMarketClassificationDisplay_Main,
            },
            Ace: {
                id: MarketClassificationId.Ace,
                displayId: StringId.MyxMarketClassificationDisplay_Ace,
            },
            Etf: {
                id: MarketClassificationId.Etf,
                displayId: StringId.MyxMarketClassificationDisplay_Etf,
            },
            Strw: {
                id: MarketClassificationId.Strw,
                displayId: StringId.MyxMarketClassificationDisplay_Strw,
            },
            Bond: {
                id: MarketClassificationId.Bond,
                displayId: StringId.MyxMarketClassificationDisplay_Bond,
            },
            Leap: {
                id: MarketClassificationId.Leap,
                displayId: StringId.MyxMarketClassificationDisplay_Leap,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (infos[id].id !== id as MarketClassificationId) {
                    throw new EnumInfoOutOfOrderError('MyxDataIvemAttribute.MarketClassificationId', id, idToDisplay(id));
                }
            }
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id) {
            return Strings[idToDisplayId(id)];
        }
    }

    export namespace ShortSellType {
        export type Id = ShortSellTypeId;

        interface Info {
            readonly id: Id;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof ShortSellTypeId]: Info };

        const infosObject: InfosObject = {
            RegulatedShortSelling: {
                id: ShortSellTypeId.RegulatedShortSelling,
                displayId: StringId.MyxShortSellTypeDisplay_RegulatedShortSelling,
            },
            ProprietaryDayTrading: {
                id: ShortSellTypeId.ProprietaryDayTrading,
                displayId: StringId.MyxShortSellTypeDisplay_ProprietaryDayTrading,
            },
            IntraDayShortSelling: {
                id: ShortSellTypeId.IntraDayShortSelling,
                displayId: StringId.MyxShortSellTypeDisplay_IntraDayShortSelling,
            },
            ProprietaryShortSelling: {
                id: ShortSellTypeId.ProprietaryShortSelling,
                displayId: StringId.MyxShortSellTypeDisplay_ProprietaryShortSelling,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (infos[id].id !== id as ShortSellTypeId) {
                    throw new EnumInfoOutOfOrderError('MyxDataIvemAttribute.ShortSellTypeId', id, idToDisplay(id));
                }
            }
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id) {
            return Strings[idToDisplayId(id)];
        }
    }

    export namespace DeliveryBasis {
        export type Id = DeliveryBasisId;

        interface Info {
            readonly id: Id;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof DeliveryBasisId]: Info };

        const infosObject: InfosObject = {
            BuyingInT0: {
                id: DeliveryBasisId.BuyingInT0,
                displayId: StringId.MyxDeliveryBasisDisplay_BuyingInT0,
            },
            DesignatedBasisT1: {
                id: DeliveryBasisId.DesignatedBasisT1,
                displayId: StringId.MyxDeliveryBasisDisplay_DesignatedBasisT1,
            },
            ReadyBasisT2: {
                id: DeliveryBasisId.ReadyBasisT2,
                displayId: StringId.MyxDeliveryBasisDisplay_ReadyBasisT2,
            },
            ImmediateBasisT1: {
                id: DeliveryBasisId.ImmediateBasisT1,
                displayId: StringId.MyxDeliveryBasisDisplay_ImmediateBasisT1,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (infos[id].id !== id as DeliveryBasisId) {
                    throw new EnumInfoOutOfOrderError('MyxDataIvemAttribute.DeliveryBasisId', id, idToDisplay(id));
                }
            }
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id) {
            return Strings[idToDisplayId(id)];
        }
    }
}

export namespace MyxDataIvemAttributesModule {
    export function initialiseStatic() {
        MyxDataIvemAttributes.Field.initialise();
        MyxDataIvemAttributes.MarketClassification.initialise();
        MyxDataIvemAttributes.ShortSellType.initialise();
        MyxDataIvemAttributes.DeliveryBasis.initialise();
    }
}
