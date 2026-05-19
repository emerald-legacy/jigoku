import DrawCard from '../../drawcard.js';
import { Durations, CardTypes } from '../../Constants.js';

class TaintedHero extends DrawCard {
    static id = 'tainted-hero';

    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.cardCannot('declareAsAttacker'),
                ability.effects.cardCannot('declareAsDefender')
            ]
        });

        this.action({
            title: 'Make text box blank',
            cost: ability.costs.sacrifice({ cardType: CardTypes.Character }),
            effect: 'blank himself',
            gameAction: ability.actions.cardLastingEffect({
                match: this,
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.blank()
            })
        });
    }
}


export default TaintedHero;
