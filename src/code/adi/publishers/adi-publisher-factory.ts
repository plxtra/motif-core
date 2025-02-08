import { UnreachableCaseError } from '@xilytix/sysutils';
import { AdiPublisher, AdiPublisherTypeId } from '../common/internal-api';
import { ZenithPublisher } from './zenith/internal-api';

export class AdiPublisherFactory implements AdiPublisher.Factory {
    createPublisher(typeId: AdiPublisherTypeId): AdiPublisher {
        switch (typeId) {
            case AdiPublisherTypeId.Zenith:
                return new ZenithPublisher();

            default:
                throw new UnreachableCaseError('DMCFS299987', typeId);
        }
    }
}
