import * as costs from '../../costs/index.js';
import { blank, cannotBeDeclaredAsAttacker, cannotBeDeclaredAsDefender } from '../../effects.js';
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
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .cardLastingEffect({
                target: this,
                duration: Duration.UntilEndOfPhase,
                effect: blank()
            })
            .effect('blank himself');
    }
}


export default TaintedHero;
