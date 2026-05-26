import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Durations, CardTypes } from '../../Constants.js';

class TaintedHero extends DrawCard {
    static id = 'tainted-hero';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.cardCannot('declareAsAttacker'),
                AbilityDsl.effects.cardCannot('declareAsDefender')
            ]
        });

        this.action({
            title: 'Make text box blank',
            cost: AbilityDsl.costs.sacrifice({ cardType: CardTypes.Character }),
            effect: 'blank himself',
            gameAction: AbilityDsl.actions.cardLastingEffect({
                target: this,
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.blank()
            })
        });
    }
}


export default TaintedHero;
