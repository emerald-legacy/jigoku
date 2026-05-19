import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes } from '../../Constants.js';

class InventiveButtressing extends DrawCard {
    static id = 'inventive-buttressing';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            condition: () => this.game.isDuringConflict('military'),
            targetLocation: Locations.Provinces,
            match: (card, context) => card === context.source.parent,
            effect: AbilityDsl.effects.modifyProvinceStrength(3)
        });
    }

    canPlayOn(source) {
        return source && source.getType() === 'province' && source.controller === this.controller && !source.isBroken && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent) {
        if(parent.type === CardTypes.Province && parent.isBroken) {
            return false;
        }

        if(parent.controller !== this.controller) {
            return false;
        }

        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}


export default InventiveButtressing;
