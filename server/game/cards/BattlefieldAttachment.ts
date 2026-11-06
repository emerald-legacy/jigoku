import { ProvinceAttachment } from './ProvinceAttachment.js';

export class BattlefieldAttachment extends ProvinceAttachment {
    public override setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { battlefield: 1 }
        });
    }
}
