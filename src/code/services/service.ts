import { EnumInfoOutOfOrderError, Integer } from '@xilytix/sysutils';
import { StringId, Strings } from '../res/internal-api';

export const enum ServiceId {
    Watchmaker,
    Scan,
}

export namespace Service {
    export type Id = ServiceId;

    interface Info {
        readonly id: Id;
        readonly name: string;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof ServiceId]: Info };

    const infosObject: InfosObject = {
        Watchmaker: {
            id: ServiceId.Watchmaker,
            name: 'Watchmaker',
            displayId: StringId.RankedDataIvemIdListDirectoryItem_TypeId_WatchmakerList, // this is wrong
        },
        Scan: {
            id: ServiceId.Scan,
            name: 'Scan',
            displayId: StringId.RankedDataIvemIdListDirectoryItem_TypeId_Scan, // this is wrong
        },
    };

    const infos = Object.values(infosObject);
    export const idCount = infos.length;

    export function initialise() {
        const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as ServiceId);
        if (outOfOrderIdx >= 0) {
            throw new EnumInfoOutOfOrderError('SI85598', outOfOrderIdx, outOfOrderIdx.toString());
        }
    }

    export function idToName(id: Id) {
        return infos[id].name;
    }

    export function idToDisplayId(id: Id): StringId {
        return infos[id].displayId;
    }

    export function idToDisplay(id: Id): string {
        return Strings[idToDisplayId(id)];
    }
}
