import { ProvinceAttachment } from './ProvinceAttachment.js';

export class BattlefieldAttachment extends ProvinceAttachment {
    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { battlefield: 1 }
        });
    }
}
