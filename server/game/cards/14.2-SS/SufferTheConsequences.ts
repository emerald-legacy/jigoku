import DrawCard from '../../DrawCard.js';
import { Phases, CardType, ConflictType, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const validSacrificeTraits = ['courtier', 'bushi', 'shugenja'];

class SufferTheConsequences extends DrawCard {
    static id = 'suffer-the-consequences';

    setupCardAbilities() {
        this.action('Gain another political conflict')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.traits.some((trait: string) => validSacrificeTraits.includes(trait)) && card.bowed
            }))
            .condition(context => context.game.currentPhase === Phases.Conflict)
            .gameAction(AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict(ConflictType.Political)
            })))
            .effect('allow {1} to declare an additional political conflict this phase', context => [context.player])
            .max(AbilityDsl.limit.perPhase(1));
    }
}


export default SufferTheConsequences;
