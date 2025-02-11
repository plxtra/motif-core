import { JsonElement, Ok, Result } from '@xilytix/sysutils';
import { PublisherId } from '../publisher/internal-api';
import { ErrorCode, JsonElementErr } from '../sys/internal-api';

/** @public */
export interface ExtensionId {
    readonly publisherId: PublisherId;
    readonly name: string;
}

/** @public */
export namespace ExtensionId {
    export namespace JsonName {
        export const publisherId = 'publisherId';
        export const name = 'name';
    }

    export const invalid: ExtensionId = {
        publisherId: PublisherId.invalid,
        name: '',
    };

    export function isEqual(left: ExtensionId, right: ExtensionId) {
        return left.name === right.name && PublisherId.isEqual(left.publisherId, right.publisherId);
    }

    export function tryCreateFromJson(value: JsonElement): Result<ExtensionId> {
        const publisherIdElementResult = value.tryGetElement(JsonName.publisherId);
        if (publisherIdElementResult.isErr()) {
            return JsonElementErr.createOuter(publisherIdElementResult.error, ErrorCode.ExtensionId_PublisherIdIsNotSpecified);
        } else {
            const publisherIdResult = PublisherId.tryCreateFromJson(publisherIdElementResult.value);
            if (publisherIdResult.isErr()) {
                return publisherIdResult.createOuter(ErrorCode.ExtensionId_PublisherIdIsInvalid);
            } else {
                const nameResult = value.tryGetString(JsonName.name)
                if (nameResult.isErr()) {
                    return JsonElementErr.createOuter(nameResult.error, ErrorCode.ExtensionId_ExtensionNameIsNotSpecifiedOrInvalid);
                } else {
                    const extensionId: ExtensionId = {
                        publisherId: publisherIdResult.value,
                        name: nameResult.value,
                    };
                    return new Ok(extensionId);
                }
            }
        }
    }

    export function saveToJson(value: ExtensionId, element: JsonElement) {
        const publisherIdElement = element.newElement(JsonName.publisherId);
        PublisherId.saveToJson(value.publisherId, publisherIdElement);
        element.setString(JsonName.name, value.name);
    }
}
