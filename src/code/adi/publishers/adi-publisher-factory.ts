import { DecimalFactory, UnreachableCaseError } from '@pbkware/js-utils';
import { AdiPublisher, AdiPublisherTypeId } from '../common/internal-api';
import { ZenithPublisher } from './zenith/internal-api';

export class AdiPublisherFactory implements AdiPublisher.Factory {
    constructor(private readonly _decimalFactory: DecimalFactory) {
    }

    createPublisher(typeId: AdiPublisherTypeId): AdiPublisher {
        switch (typeId) {
            case AdiPublisherTypeId.Zenith:
                return new ZenithPublisher(this._decimalFactory);

            default:
                throw new UnreachableCaseError('DMCFS299987', typeId);
        }
    }
}
