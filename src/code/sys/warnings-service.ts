export class WarningsService {
    private readonly _warnings = new Array<WarningsService.Warning>();

    get warnings(): readonly WarningsService.Warning[] { return this._warnings; }

    add(typeId: WarningsService.TypeId, text: string): void {
        const warning: WarningsService.Warning = {
            typeId,
            text,
        };
        this._warnings.push(warning);
    }
}

export namespace WarningsService {
    export const enum TypeId {
        ServerConfig,
    }

    export interface Warning {
        readonly typeId: TypeId;
        readonly text: string;
    }
}
