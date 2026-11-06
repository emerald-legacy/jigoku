import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';
import { unlimited } from '../../AbilityLimit.js';

class ThirdTower extends DrawCard {
    static id = 'third-tower';

    override setupCardAbilities() {
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
                    return !cards.some((card) => card.isFaceup() && card.type === CardType.Holding && card.hasTrait(Trait.KaiuWall));
                }
            })
            .takeHonor()
            .limit(unlimited());
    }
}


export default ThirdTower;
