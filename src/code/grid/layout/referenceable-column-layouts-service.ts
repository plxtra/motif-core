import { RevReferenceableColumnLayout, RevReferenceableColumnLayoutDefinition, RevReferenceableColumnLayouts } from 'revgrid';
import { LockOpenList } from '../../sys/internal-api';

export class ReferenceableColumnLayoutsService extends LockOpenList<RevReferenceableColumnLayout> implements RevReferenceableColumnLayouts {
    getOrNew(definition: RevReferenceableColumnLayoutDefinition): RevReferenceableColumnLayout {
        let source = this.getItemByKey(definition.id);
        if (source === undefined) {
            source = this.createReferenceableColumnLayout(definition);
            this.add(source);
        }
        return source;
    }

    private createReferenceableColumnLayout(definition: RevReferenceableColumnLayoutDefinition) {
        const index = this.count;
        const result = new RevReferenceableColumnLayout(definition, index);
        return result;
    }
}
