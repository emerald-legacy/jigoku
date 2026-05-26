import DrawCard from '../../drawcard.js';
import { Phases, CardTypes, ConflictTypes, Durations } from '../../Constants.js';
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
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.traits.some((trait: any) => validSacrificeTraits.includes(trait)) && card.bowed
            }),
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict(ConflictTypes.Political)
            }))
        });
    }
}


export default SufferTheConsequences;
