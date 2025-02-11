import { RevColumnLayoutDefinition } from '@xilytix/revgrid';
import { Err, JsonElement, Ok, Result, UnreachableCaseError } from '@xilytix/sysutils';
import { BidAskPair, ErrorCode } from '../../../sys/internal-api';

/** @public */
export namespace ColumnLayoutDefinition {
    export function tryCreateFromJson(element: JsonElement): Result<RevColumnLayoutDefinition> {
        const createResult = RevColumnLayoutDefinition.tryCreateFromJson(element);
        if (createResult.isErr()) {
            const errorId = createResult.error;
            let errorCode: string;
            switch (errorId) {
                case RevColumnLayoutDefinition.CreateFromJsonErrorId.ColumnsElementIsNotDefined:
                    errorCode = ErrorCode.ColumnLayoutDefinition_ColumnsElementIsNotDefined;
                    break;
                case RevColumnLayoutDefinition.CreateFromJsonErrorId.ColumnsElementIsNotAnArray:
                    errorCode = ErrorCode.ColumnLayoutDefinition_ColumnsElementIsNotAnArray;
                    break;
                case RevColumnLayoutDefinition.CreateFromJsonErrorId.ColumnElementIsNotAnObject:
                    errorCode = ErrorCode.ColumnLayoutDefinition_ColumnElementIsNotAnObject;
                    break;
                case RevColumnLayoutDefinition.CreateFromJsonErrorId.AllColumnElementsAreInvalid:
                    errorCode = ErrorCode.ColumnLayoutDefinition_AllColumnElementsAreInvalid;
                    break;
                default:
                    throw new UnreachableCaseError('GLDTCFJ59712', errorId);
            }
            return new Err(errorCode);
        } else {
            return new Ok(createResult.value);
        }
    }
}

export type BidAskColumnLayoutDefinitions = BidAskPair<RevColumnLayoutDefinition>;
