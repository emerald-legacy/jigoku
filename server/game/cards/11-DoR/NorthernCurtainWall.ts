import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Locations } from '../../Constants.js';

class NorthernCurtainWall extends DrawCard {
    static id = 'northern-curtain-wall';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: (card, context) => {
                if(card.type === CardTypes.Holding) {
                    let isWall = card.hasTrait('kaiu-wall') && card.isFaceup();
                    return isWall && context !== undefined && context.player.areLocationsAdjacent(context.source.location, card.location);
                }
                return false;
            },
            effect: AbilityDsl.effects.modifyProvinceStrengthBonus(2)
        });
    }
}


export default NorthernCurtainWall;
