import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class NorthernCurtainWall extends DrawCard {
    static id = 'northern-curtain-wall';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card: DrawCard, context) => {
                if(card.type === CardType.Holding) {
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
