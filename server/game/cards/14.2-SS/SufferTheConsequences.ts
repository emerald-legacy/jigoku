import DrawCard from '../../DrawCard.js';
import { Phase, CardType, ConflictType, Duration, Trait } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perPhase } from '../../AbilityLimit.js';
import { additionalConflict } from '../../effects.js';
import { msg } from '../../GameChat.js';

class SufferTheConsequences extends DrawCard {
    static id = 'suffer-the-consequences';

    override setupCardAbilities() {
        this.action('Gain another political conflict')
            .condition((context) => context.game.currentPhase === Phase.Conflict)
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasSomeTrait(Trait.Courtier, Trait.Bushi, Trait.Shugenja) && card.bowed
            }))
            .playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Political)
            })
            .chatText((context) => msg`allow ${context.player} to declare an additional political conflict this phase`)
            .max(perPhase(1));
    }
}


export default SufferTheConsequences;
