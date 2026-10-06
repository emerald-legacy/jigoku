import DrawCard from '../../DrawCard.js';
import { Phases, CardType, ConflictType, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { additionalConflict } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

const validSacrificeTraits = ['courtier', 'bushi', 'shugenja'];

class SufferTheConsequences extends DrawCard {
    static id = 'suffer-the-consequences';

    setupCardAbilities() {
        this.action('Gain another political conflict')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.traits.some((trait) => validSacrificeTraits.includes(trait)) && card.bowed
            }))
            .condition(context => context.game.currentPhase === Phases.Conflict)
            .gameAction(playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Political)
            })))
            .effect((context) => msg`allow ${context.player} to declare an additional political conflict this phase`)
            .max(AbilityDsl.limit.perPhase(1));
    }
}


export default SufferTheConsequences;
