export interface DestroyableRecord {
    readonly destroyed: boolean;
    destroy(): void;
}
