import { EnumInfoOutOfOrderError, UnreachableCaseError } from '@xilytix/sysutils';
import { StringId, Strings } from '../res/internal-api';

/** @public */
export const enum CorrectnessId {
    Good,
    Usable,
    Suspect,
    Error,
}

/** @public */
export namespace Correctness {
    export type Id = CorrectnessId;

    interface Info {
        readonly id: CorrectnessId;
        readonly usable: boolean;
        readonly displayId: StringId;
    }

    type InfosObject = { [id in keyof typeof CorrectnessId]: Info };

    const infosObject: InfosObject = {
        Good: { id: CorrectnessId.Good,
            usable: true,
            displayId: StringId.CorrectnessDisplay_Good,
        },
        Usable: { id: CorrectnessId.Usable,
            usable: true,
            displayId: StringId.CorrectnessDisplay_Usable,
        },
        Suspect: { id: CorrectnessId.Suspect,
            usable: false,
            displayId: StringId.CorrectnessDisplay_Suspect,
        },
        Error: { id: CorrectnessId.Error,
            usable: false,
            displayId: StringId.CorrectnessDisplay_Error,
        }
    } as const;

    export const idCount = Object.keys(infosObject).length;
    const infos = Object.values(infosObject);

    export function initialise() {
        for (let id = 0; id < idCount; id++) {
            if (id as CorrectnessId !== infos[id].id) {
                throw new EnumInfoOutOfOrderError('CorrectnessId', id, id.toString());
            }
        }
    }

    export function idToDisplay(id: CorrectnessId) {
        return Strings[infos[id].displayId];
    }

    export function idIsUsable(id: CorrectnessId) {
        return infos[id].usable;
    }

    export function idIsUnusable(id: CorrectnessId) {
        return !infos[id].usable;
    }

    export function idIsIncubated(id: CorrectnessId) {
        return id !== CorrectnessId.Suspect;
    }

    export function merge2UndefinableIds(id1: CorrectnessId | undefined, id2: CorrectnessId | undefined): CorrectnessId | undefined {
        if (id1 === undefined) {
            return id2 === undefined ? undefined : id2;
        } else {
            return id2 === undefined ? id1 : merge2Ids(id1, id2);
        }
    }

    export function merge2Ids(id1: CorrectnessId, id2: CorrectnessId): CorrectnessId {
        switch (id1) {
            case CorrectnessId.Good:
                return id2;
            case CorrectnessId.Usable:
                return (id2 === CorrectnessId.Good || id2 === CorrectnessId.Usable) ? CorrectnessId.Usable : id2;
            case CorrectnessId.Suspect:
                return (id2 !== CorrectnessId.Error) ? CorrectnessId.Suspect : CorrectnessId.Error;
            case CorrectnessId.Error:
                return CorrectnessId.Error;
            default:
                throw new UnreachableCaseError('CM2I90092957346', id1);
        }
    }

    export function merge3UndefinableIds(id1: CorrectnessId | undefined, id2: CorrectnessId | undefined, id3: CorrectnessId | undefined): CorrectnessId | undefined {
        if (id1 === undefined) {
            return merge2UndefinableIds(id2, id3);
        } else {
            if (id2 === undefined) {
                return id3 === undefined ? id1 : merge2Ids(id1, id3);
            } else {
                return id3 === undefined ? merge2Ids(id1, id2) : merge3Ids(id1, id2, id3);
            }
        }
    }

    export function merge3Ids(id1: CorrectnessId, id2: CorrectnessId, id3: CorrectnessId): CorrectnessId {
        switch (id1) {
            case CorrectnessId.Good:
                switch (id2) {
                    case CorrectnessId.Good:
                        return id3;
                    case CorrectnessId.Usable:
                        return (id3 === CorrectnessId.Good || id3 === CorrectnessId.Usable) ? CorrectnessId.Usable : id3;
                    case CorrectnessId.Suspect:
                        return (id3 !== CorrectnessId.Error) ? CorrectnessId.Suspect : CorrectnessId.Error;
                    case CorrectnessId.Error:
                        return CorrectnessId.Error;
                    default:
                        throw new UnreachableCaseError('CM3IGDG30999885', id2);
                }
            case CorrectnessId.Usable:
                switch (id2) {
                    case CorrectnessId.Good:
                    case CorrectnessId.Usable:
                        return (id3 === CorrectnessId.Good || id3 === CorrectnessId.Usable) ? CorrectnessId.Usable : id3;
                    case CorrectnessId.Suspect:
                        return (id3 !== CorrectnessId.Error) ? CorrectnessId.Suspect : CorrectnessId.Error;
                    case CorrectnessId.Error:
                        return CorrectnessId.Error;
                    default:
                        throw new UnreachableCaseError('CM3ISDU323332395', id2);
                }
            case CorrectnessId.Suspect:
                switch (id2) {
                    case CorrectnessId.Good:
                    case CorrectnessId.Usable:
                    case CorrectnessId.Suspect:
                        return (id3 !== CorrectnessId.Error) ? CorrectnessId.Suspect : CorrectnessId.Error;
                    case CorrectnessId.Error:
                        return CorrectnessId.Error;
                    default:
                        throw new UnreachableCaseError('CM3ISDS3395345325', id2);
                }
            case CorrectnessId.Error:
                return CorrectnessId.Error;
            default:
                throw new UnreachableCaseError('CM3I1DU49900999082', id1);
        }
    }
}

/** @internal */
export namespace CorrectnessModule {
    export function initialiseStatic(): void {
        Correctness.initialise();
    }
}
