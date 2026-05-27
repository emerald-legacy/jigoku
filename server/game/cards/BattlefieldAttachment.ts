import { CardTypes } from '../Constants.js';
import BaseCard from '../basecard.js';
import DrawCard from '../drawcard.js';
import { ProvinceCard } from '../ProvinceCard.js';

export class BattlefieldAttachment extends DrawCard {
    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { battlefield: 1 }
        });
    }

    public canPlayOn(source: any) {
        return (
            source &&
            source.getType() === 'province' &&
            (!this.unbrokenOnly() || !source.isBroken) &&
            this.getType() === CardTypes.Attachment
        );
    }

    public canAttach(parent: BaseCard) {
        if(this.unbrokenOnly() && parent instanceof ProvinceCard && parent.isBroken) {
            return false;
        }

        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }

    protected unbrokenOnly(): boolean {
        return true;
    }
}
