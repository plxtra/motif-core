export interface Incubator {
    readonly incubating: boolean;

    finalise(): void;
    cancel(): void;
}
