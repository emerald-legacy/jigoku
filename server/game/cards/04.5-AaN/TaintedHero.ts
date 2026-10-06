import AbilityDsl from '../../abilitydsl.js';
import { blank, cannotBeDeclaredAsAttacker, cannotBeDeclaredAsDefender } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';

class TaintedHero extends DrawCard {
    static id = 'tainted-hero';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                cannotBeDeclaredAsAttacker(),
                cannotBeDeclaredAsDefender()
            ]
        });

        this.action('Make text box blank')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .gameAction(cardLastingEffect({
                target: this,
                duration: Duration.UntilEndOfPhase,
                effect: blank()
            }))
            .effect('blank himself');
    }
}


export default TaintedHero;
