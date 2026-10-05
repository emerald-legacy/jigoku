import { ProvinceAttachment } from './ProvinceAttachment.js';

/** A Battlefield province attachment: one per province. */
export class BattlefieldAttachment extends ProvinceAttachment {
    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { battlefield: 1 }
        });
    }
}
