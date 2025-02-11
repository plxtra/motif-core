import {
    AssertInternalError,
    compareInteger,
    compareString,
    ComparisonResult,
    EnumInfoOutOfOrderError,
    Err,
    Integer,
    JsonElement,
    Ok,
    Result
} from '@xilytix/sysutils';
import {
    ErrorCode,
    JsonElementErr,
} from "../sys/internal-api";
import { BrokerageAccountEnvironmentedId } from './brokerage-account-environmented-id';
import { MarketsService } from './markets/internal-api';

export abstract class BrokerageAccountGroup {
    private _upperDisplay: string;

    constructor(readonly typeId: BrokerageAccountGroup.TypeId) { }

    get display(): string { return this.getDisplay(); }
    get upperDisplay(): string {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._upperDisplay === undefined) {
            this._upperDisplay = this.display.toUpperCase();
        }
        return this._upperDisplay;
    }

    saveToJson(element: JsonElement) {
        element.setString(BrokerageAccountGroup.JsonTag.TypeId, BrokerageAccountGroup.Type.idToJsonValue(this.typeId));
    }

    isSingle() {
        return this.typeId === BrokerageAccountGroup.TypeId.Single;
    }

    isAll() {
        return this.typeId === BrokerageAccountGroup.TypeId.All;
    }

    isEqualTo(other: BrokerageAccountGroup) {
        if (this.typeId !== other.typeId) {
            return false;
        } else {
            return this.isSameTypeEqualTo(other);
        }
    }

    compareTo(other: BrokerageAccountGroup): ComparisonResult {
        let result = BrokerageAccountGroup.Type.compareId(this.typeId, other.typeId);
        if (result === ComparisonResult.LeftEqualsRight) {
            result = this.sameTypeCompareTo(other);
        }
        return result;
    }

    protected abstract getDisplay(): string;
    protected abstract isSameTypeEqualTo(other: BrokerageAccountGroup): boolean;
    protected abstract sameTypeCompareTo(other: BrokerageAccountGroup): Integer;
}

export namespace BrokerageAccountGroup {
    export const enum JsonTag {
        TypeId = 'typeId',
    }

    export const enum TypeId {
        Single,
        All,
    }

    export function createAll() {
        return new AllBrokerageAccountGroup();
    }

    export function createSingle(marketsService: MarketsService, accountZenithCode: string) {
        return new SingleBrokerageAccountGroup(marketsService, accountZenithCode);
    }

    export function isSingle(group: BrokerageAccountGroup): group is SingleBrokerageAccountGroup {
        return group.typeId === BrokerageAccountGroup.TypeId.Single;
    }

    export function isEqual(left: BrokerageAccountGroup, right: BrokerageAccountGroup) {
        return left.isEqualTo(right);
    }

    export function isUndefinableEqual(left: BrokerageAccountGroup | undefined, right: BrokerageAccountGroup | undefined) {
        if (left === undefined) {
            return right === undefined;
        } else {
            return right === undefined ? false : left.isEqualTo(right);
        }
    }

    export function compare(left: BrokerageAccountGroup, right: BrokerageAccountGroup) {
        return left.compareTo(right);
    }

    export function compareUndefinable(left: BrokerageAccountGroup | undefined, right: BrokerageAccountGroup | undefined) {
        if (left === undefined) {
            return right === undefined ? 0 : -1;
        } else  {
            if (right === undefined) {
                return 1;
            } else {
                return left.compareTo(right);
            }
        }
    }

    export function tryCreateFromJson(marketsService: MarketsService, element: JsonElement): Result<BrokerageAccountGroup> {
        const typeIdJsonValueResult = element.tryGetString(JsonTag.TypeId);
        if (typeIdJsonValueResult.isErr()) {
            return JsonElementErr.createOuter(typeIdJsonValueResult.error, ErrorCode.BrokerageAccountGroup_TypeIdIsInvalid);
        } else {
            const typeIdJsonValue = typeIdJsonValueResult.value;
            const typeId = Type.tryJsonValueToId(typeIdJsonValue);
            if (typeId === undefined) {
                return new Err(`${ErrorCode.BrokerageAccountGroup_TypeIdIsUnknown}(${typeIdJsonValue})`);
            } else {
                switch (typeId) {
                    case BrokerageAccountGroup.TypeId.Single: {
                        const singleResult = SingleBrokerageAccountGroup.tryCreateFromJson(marketsService, element);
                        if (singleResult.isErr()) {
                            return singleResult.createOuter(ErrorCode.BrokerageAccountGroup_SingleInvalid);
                        } else {
                            return new Ok(singleResult.value);
                        }
                    }
                    case BrokerageAccountGroup.TypeId.All: {
                        const allGroup = new AllBrokerageAccountGroup();
                        return new Ok(allGroup);
                    }
                    default: {
                        const neverTypeIdIgnored: never = typeId;
                        return new Err(`${ErrorCode.BrokerageAccountGroup_TypeIdIsUnsupported}(${neverTypeIdIgnored as Integer})`);
                    }
                }
            }
        }
    }

    export namespace Type {
        interface Info {
            readonly id: BrokerageAccountGroup.TypeId;
            readonly name: string;
            readonly jsonValue: string;
        }

        type InfoObject = { [id in keyof typeof BrokerageAccountGroup.TypeId]: Info };

        const infoObject: InfoObject = {
            Single: {
                id: BrokerageAccountGroup.TypeId.Single,
                name: 'Account',
                jsonValue: 'account',
            },
            All: {
                id: BrokerageAccountGroup.TypeId.All,
                name: 'All',
                jsonValue: 'all',
            },
        };

        export const idCount = Object.keys(infoObject).length;
        const infos = Object.values(infoObject);

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                if (id as TypeId !== infos[id].id) {
                    throw new EnumInfoOutOfOrderError('FieldDataTypeId', id, infos[id].name);
                }
            }
        }

        export function idToName(id: BrokerageAccountGroup.TypeId) {
            return infos[id].name;
        }

        export function idToJsonValue(id: BrokerageAccountGroup.TypeId) {
            return infos[id].jsonValue;
        }

        export function tryJsonValueToId(value: string): BrokerageAccountGroup.TypeId | undefined {
            for (let i = 0; i < idCount; i++) {
                if (infos[i].jsonValue === value) {
                    return i;
                }
            }
            return undefined;
        }

        export function compareId(left: BrokerageAccountGroup.TypeId, right: BrokerageAccountGroup.TypeId) {
            return compareInteger(left, right);
        }
    }
}

export class SingleBrokerageAccountGroup extends BrokerageAccountGroup {
    private readonly _accountId: BrokerageAccountEnvironmentedId;

    constructor(marketsService: MarketsService, readonly accountZenithCode: string) {
        super(SingleBrokerageAccountGroup.typeId);
        this._accountId = BrokerageAccountEnvironmentedId.createFromZenithCode(marketsService, accountZenithCode);
    }

    override saveToJson(element: JsonElement) {
        super.saveToJson(element);
        element.setString(SingleBrokerageAccountGroup.JsonName.accountZenithCode, this.accountZenithCode);
    }

    protected getDisplay(): string {
        return this._accountId.display;
    }

    protected isSameTypeEqualTo(other: BrokerageAccountGroup): boolean {
        if (other instanceof SingleBrokerageAccountGroup) {
            return this.accountZenithCode === other.accountZenithCode;
        } else {
            throw new AssertInternalError('BAGSBAGISTET39998');
        }
    }

    protected sameTypeCompareTo(other: BrokerageAccountGroup): ComparisonResult {
        if (other instanceof SingleBrokerageAccountGroup) {
            return compareString(this.accountZenithCode, other.accountZenithCode);
        } else {
            throw new AssertInternalError('BAGSBAGSYCT39998');
        }
    }
}

export namespace SingleBrokerageAccountGroup {
    export const typeId = BrokerageAccountGroup.TypeId.Single;

    export const enum JsonName {
        accountZenithCode = 'accountZenithCode'
    }

    export function tryCreateFromJson(marketsService: MarketsService, element: JsonElement): Result<SingleBrokerageAccountGroup> {
        const accountZenithCodeResult = element.tryGetString(JsonName.accountZenithCode);
        if (accountZenithCodeResult.isErr()) {
            return JsonElementErr.createOuter(accountZenithCodeResult.error, ErrorCode.SingleBrokerageAccountGroup_AccountZenithCodeNotSpecified);
        } else {
            const accountZenithCode = accountZenithCodeResult.value;
            const group = BrokerageAccountGroup.createSingle(marketsService, accountZenithCode);
            return new Ok(group);
        }
    }
}

export class AllBrokerageAccountGroup extends BrokerageAccountGroup {
    constructor() {
        super(AllBrokerageAccountGroup.typeId);
    }

    protected getDisplay() {
        return AllBrokerageAccountGroup.display;
    }

    protected isSameTypeEqualTo(other: BrokerageAccountGroup) {
        return true;
    }

    protected sameTypeCompareTo(other: BrokerageAccountGroup) {
        return 0;
    }
}

export namespace AllBrokerageAccountGroup {
    export const typeId = BrokerageAccountGroup.TypeId.All;
    export const display = '<All>';
}

export namespace BrokerageAccountGroupModule {
    export function initialiseStatic() {
        BrokerageAccountGroup.Type.initialise();
    }
}
