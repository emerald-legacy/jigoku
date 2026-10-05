import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';

class TaintedHero extends DrawCard {
    static id = 'tainted-hero';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.cannotBeDeclaredAsAttacker(),
                AbilityDsl.effects.cannotBeDeclaredAsDefender()
            ]
        });

        this.action('Make text box blank')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .gameAction(AbilityDsl.actions.cardLastingEffect({
                target: this,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.blank()
            }))
            .effect('blank himself');
    }
}


export default TaintedHero;
