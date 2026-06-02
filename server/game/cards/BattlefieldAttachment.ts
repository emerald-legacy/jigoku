import { CardType } from '../Constants.js';
import BaseCard from '../BaseCard.js';
import DrawCard from '../DrawCard.js';
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
            this.getType() === CardType.Attachment
        );
    }

    public canAttach(parent: BaseCard) {
        if(this.unbrokenOnly() && parent instanceof ProvinceCard && parent.isBroken) {
            return false;
        }

        return parent && parent.getType() === CardType.Province && this.getType() === CardType.Attachment;
    }

    protected unbrokenOnly(): boolean {
        return true;
    }
}
