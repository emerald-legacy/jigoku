import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class ScholarOfOldRempet extends DrawCard {
    static id = 'scholar-of-old-rempet';

    setupCardAbilities() {
        this.action('Make character immune to events')
            .cost(AbilityDsl.costs.payHonor(1))
            .condition(() => this.game.isDuringConflict())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => !card.isUnique()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.immunity({ restricts: 'events' })
            }))
            .effect('make {0} immune to events');
    }
}


export default ScholarOfOldRempet;
