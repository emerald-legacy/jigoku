import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType, Players } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import type Ring from '../../Ring.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import type Player from '../../Player.js';

class Unhallow extends DrawCard {
    static id = 'unhallow';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card, context) => card === context?.source.parent,
            effect: AbilityDsl.effects.modifyProvinceStrength(3)
        });

        this.persistentEffect({
            condition: (context) => !!(context.source.parent && context.source.parent.isConflictProvince()),
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            effect: AbilityDsl.effects.costToDeclareAnyParticipants({
                type: 'defenders',
                message: 'loses 1 honor',
                cost: (player: Player) => AbilityDsl.actions.loseHonor({
                    target: player,
                    amount: 1
                })
            })
        });
    }

    canPlayOn(source: BaseCard | Ring) {
        return source && source.getType() === 'province' && (source as ProvinceCard).controller === this.controller && !(source as ProvinceCard).isBroken && this.getType() === CardType.Attachment;
    }

    canAttach(parent: BaseCard) {
        if(parent.type === CardType.Province && (parent as ProvinceCard).isBroken) {
            return false;
        }

        if(parent.controller !== this.controller) {
            return false;
        }

        return parent && parent.getType() === CardType.Province && this.getType() === CardType.Attachment;
    }

    isTemptationsMaho() {
        return true;
    }
}


export default Unhallow;
