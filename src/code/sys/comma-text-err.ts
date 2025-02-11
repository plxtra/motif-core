/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CommaText, Err, UnreachableCaseError } from '@xilytix/sysutils';
import { ErrorCode } from './error-code';

/** @public */
export class CommaTextErr<T = undefined> extends Err<T> {
    constructor(readonly errorId: CommaText.ErrorId, readonly extraInfo: string) {
        const errorCode = CommaTextErr.errorIdToCode(errorId);
        super(errorCode);
    }
}

/** @public */
export namespace CommaTextErr {
    export function create<T>(errorIdPlusExtra: CommaText.ErrorIdPlusExtra<CommaText.ErrorId>): CommaTextErr<T> {
        return new CommaTextErr(errorIdPlusExtra.errorId, errorIdPlusExtra.extraInfo);
    }

    export function createOuter<OuterT = undefined>(errorIdPlusExtra: CommaText.ErrorIdPlusExtra<CommaText.ErrorId>, outerErrorText: string): Err<OuterT> {
        const innerCommaTextErr = new CommaTextErr(errorIdPlusExtra.errorId, errorIdPlusExtra.extraInfo);
        return innerCommaTextErr.createOuter(outerErrorText);
    }

    export function errorIdToCode(errorId: CommaText.ErrorId): ErrorCode {
        switch (errorId) {
            case CommaText.ErrorId.UnexpectedCharAfterQuotedElement: return ErrorCode.CommaText_UnexpectedCharAfterQuotedElement;
            case CommaText.ErrorId.QuotesNotClosedInLastElement: return ErrorCode.CommaText_QuotesNotClosedInLastElement;
            case CommaText.ErrorId.InvalidIntegerString: return ErrorCode.CommaText_InvalidIntegerString;
            default:
                throw new UnreachableCaseError('CTEEIITC44812', errorId);
        }
    }

    export function errorIdPlusExtraToCodePlusExtra(errorIdPlusExtra: CommaText.ErrorIdPlusExtra<CommaText.ErrorId>) {
        return `${errorIdToCode(errorIdPlusExtra.errorId)}: ${errorIdPlusExtra.extraInfo}`;
    }
}
