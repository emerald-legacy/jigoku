import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { TargetMode } from '../../Constants.js';

class WindsweptYurt extends DrawCard {
    static id = 'windswept-yurt';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Gain 2 fate or 2 honor',
            target: {
                mode: TargetMode.Select,
                choices: {
                    'Each player gains 2 fate': ability.actions.gainFate((context: AbilityContext) => ({
                        amount: 2,
                        target: context.game.getPlayers()
                    })),
                    'Each player gains 2 honor': ability.actions.gainHonor((context: AbilityContext) => ({
                        amount: 2,
                        target: context.game.getPlayers()
                    }))
                }
            },
            cost: ability.costs.sacrificeSelf(),
            effect: 'give each player 2 {1}',
            effectArgs: context => context.select === 'Each player gains 2 fate' ? 'fate' : 'honor',
            gameAction: ability.actions.refillFaceup((context: AbilityContext) => ({ location: (context.cardStateWhenInitiated as DrawCard).location }))
        });
    }
}


export default WindsweptYurt;
