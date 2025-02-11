import { RevDataSourceOrReference } from '@xilytix/revgrid';
import { AssertInternalError, Err, LockOpenListItem, Ok, PickEnum, Result, UnreachableCaseError } from '@xilytix/sysutils';
import { TextFormattableValue } from '../../services/internal-api';
import { Badness, ErrorCode } from '../../sys/internal-api';
import { TableFieldSourceDefinition, TableRecordSourceDefinition } from '../table/internal-api';

export class DataSourceOrReference extends RevDataSourceOrReference<
    Badness,
    TableRecordSourceDefinition.TypeId,
    TableFieldSourceDefinition.TypeId,
    TextFormattableValue.TypeId,
    TextFormattableValue.Attribute.TypeId
> {
}

export namespace DataSourceOrReference {
    export function tryLock(dataSourceOrReference: DataSourceOrReference, locker: LockOpenListItem.Locker): Promise<Result<void>> {
        // Replace with Promise.withResolvers when available in TypeScript (ES2023)
        let resolve: (value: Result<void>) => void;
        const resultPromise = new Promise<Result<void>>((res) => {
            resolve = res;
        });

        const lockPromise = dataSourceOrReference.tryLock(locker);
        lockPromise.then(
            (result) => {
                if (result.isOk()) {
                    resolve(new Ok(undefined));
                } else {
                    const lockErrorIdPlusTryError = result.error;
                    const lockErrorId = lockErrorIdPlusTryError.errorId;
                    let errorText = DataSourceOrReference.LockErrorCode.fromId(lockErrorId) as string;
                    const tryError = lockErrorIdPlusTryError.tryError;
                    if (tryError !== undefined) {
                        errorText = `: ${tryError}`;
                    }
                    resolve(new Err(errorText));
                }
            },
            (reason) => { throw AssertInternalError.createIfNotError(reason, 'DSORTCL35252'); }
        )

        return resultPromise;
    }

    export function formatError(lockErrorIdPlusTryError: RevDataSourceOrReference.LockErrorIdPlusTryError) {
        const errorCode = LockErrorCode.fromId(lockErrorIdPlusTryError.errorId);
        const tryError = lockErrorIdPlusTryError.tryError;
        return tryError === undefined ? errorCode : `${errorCode}: ${tryError}`;
    }

    export type LockErrorCode = PickEnum<ErrorCode,
        ErrorCode.DataSourceOrReference_TableRecordSourceTry |
        ErrorCode.DataSourceOrReference_LayoutDefinitionTry |
        ErrorCode.DataSourceOrReference_LayoutReferenceTry |
        ErrorCode.DataSourceOrReference_LayoutReferenceNotFound |
        ErrorCode.DataSourceOrReference_ReferenceableTableRecordSourceTry |
        ErrorCode.DataSourceOrReference_ReferenceableLayoutDefinitionTry |
        ErrorCode.DataSourceOrReference_ReferenceableLayoutReferenceTry |
        ErrorCode.DataSourceOrReference_ReferenceableLayoutReferenceNotFound |
        ErrorCode.DataSourceOrReference_ReferenceableNotFound
    >;

    export namespace LockErrorCode {
        export function fromId(lockErrorId: RevDataSourceOrReference.LockErrorId): LockErrorCode {
            switch (lockErrorId) {
                case RevDataSourceOrReference.LockErrorId.TableRecordSourceTry: return ErrorCode.DataSourceOrReference_TableRecordSourceTry;
                case RevDataSourceOrReference.LockErrorId.LayoutDefinitionTry: return ErrorCode.DataSourceOrReference_LayoutDefinitionTry;
                case RevDataSourceOrReference.LockErrorId.LayoutReferenceTry: return ErrorCode.DataSourceOrReference_LayoutReferenceTry;
                case RevDataSourceOrReference.LockErrorId.LayoutReferenceNotFound: return ErrorCode.DataSourceOrReference_LayoutReferenceNotFound;
                case RevDataSourceOrReference.LockErrorId.ReferenceableTableRecordSourceTry: return ErrorCode.DataSourceOrReference_ReferenceableTableRecordSourceTry;
                case RevDataSourceOrReference.LockErrorId.ReferenceableLayoutDefinitionTry: return ErrorCode.DataSourceOrReference_ReferenceableLayoutDefinitionTry;
                case RevDataSourceOrReference.LockErrorId.ReferenceableLayoutReferenceTry: return ErrorCode.DataSourceOrReference_ReferenceableLayoutReferenceTry;
                case RevDataSourceOrReference.LockErrorId.ReferenceableLayoutReferenceNotFound: return ErrorCode.DataSourceOrReference_ReferenceableLayoutReferenceNotFound;
                case RevDataSourceOrReference.LockErrorId.ReferenceableNotFound: return ErrorCode.DataSourceOrReference_ReferenceableNotFound;
                default:
                    throw new UnreachableCaseError('DSORLECFI35252', lockErrorId);
            }
        }
    }
}
