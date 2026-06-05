import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type Ring from '../../Ring.js';

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

    canPlayOn(source: BaseCard | Ring) {
        return source && source.getType() === 'province' && (source as BaseCard).controller === this.controller && !(source instanceof ProvinceCard && source.isBroken) && this.getType() === CardType.Attachment;
    }

    canAttach(parent: BaseCard) {
        if(parent.type === CardType.Province && parent instanceof ProvinceCard && parent.isBroken) {
            return false;
        }

        if(parent.controller !== this.controller) {
            return false;
        }

        return parent && parent.getType() === CardType.Province && this.getType() === CardType.Attachment;
    }
}


export default InventiveButtressing;
