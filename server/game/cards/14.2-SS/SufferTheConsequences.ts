import DrawCard from '../../DrawCard.js';
import { Phase, CardType, ConflictType, Duration } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { perPhase } from '../../AbilityLimit.js';
import { additionalConflict } from '../../effects.js';
import { msg } from '../../GameChat.js';

const validSacrificeTraits = ['courtier', 'bushi', 'shugenja'];

class SufferTheConsequences extends DrawCard {
    static id = 'suffer-the-consequences';

    setupCardAbilities() {
        this.action('Gain another political conflict')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.traits.some((trait) => validSacrificeTraits.includes(trait)) && card.bowed
            }))
            .condition(context => context.game.currentPhase === Phase.Conflict)
            .playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Political)
            }))
            .chatText((context) => msg`allow ${context.player} to declare an additional political conflict this phase`)
            .max(perPhase(1));
    }
}


export default SufferTheConsequences;
