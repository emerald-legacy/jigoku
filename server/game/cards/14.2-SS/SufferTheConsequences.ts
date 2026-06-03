import DrawCard from '../../DrawCard.js';
import { Phases, CardType, ConflictType, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const validSacrificeTraits = ['courtier', 'bushi', 'shugenja'];

class SufferTheConsequences extends DrawCard {
    static id = 'suffer-the-consequences';

    setupCardAbilities() {
        this.action({
            title: 'Gain another political conflict',
            effect: 'allow {1} to declare an additional political conflict this phase',
            effectArgs: context => [context.player],
            max: AbilityDsl.limit.perPhase(1),
            condition: context => context.game.currentPhase === Phases.Conflict,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card: any) => card.traits.some((trait: any) => validSacrificeTraits.includes(trait)) && card.bowed
            }),
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict(ConflictType.Political)
            }))
        });
    }
}


export default SufferTheConsequences;
