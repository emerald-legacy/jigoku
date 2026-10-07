import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ThirdTower extends DrawCard {
    static id = 'third-tower';

    setupCardAbilities() {
        this.reaction('Take an honor from your opponent')
            .when({
                onConflictDeclared: (event, context) => {
                    if(event.conflict.attackingPlayer === context.player) {
                        return false;
                    }
                    if(!event.conflict.declaredProvince) {
                        return false;
                    }
                    const cards = context.player.getDynastyCardsInProvince(event.conflict.declaredProvince.location);
                    return !cards.some((card) => card.isFaceup() && card.type === CardType.Holding && card.hasTrait('kaiu-wall'));
                }
            })
            .takeHonor()
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default ThirdTower;
