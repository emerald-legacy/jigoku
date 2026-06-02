import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';

class InventiveButtressing extends DrawCard {
    static id = 'inventive-buttressing';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            condition: () => this.game.isDuringConflict('military'),
            targetLocation: Location.Provinces,
            match: (card, context) => card === context?.source.parent,
            effect: AbilityDsl.effects.modifyProvinceStrength(3)
        });
    }

    canPlayOn(source: any) {
        return source && source.getType() === 'province' && source.controller === this.controller && !source.isBroken && this.getType() === CardType.Attachment;
    }

    canAttach(parent: any) {
        if(parent.type === CardType.Province && parent.isBroken) {
            return false;
        }

        if(parent.controller !== this.controller) {
            return false;
        }

        return parent && parent.getType() === CardType.Province && this.getType() === CardType.Attachment;
    }
}


export default InventiveButtressing;
