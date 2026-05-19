import DrawCard from '../../drawcard.js';
import { TargetModes } from '../../Constants.js';

class WindsweptYurt extends DrawCard {
    static id = 'windswept-yurt';

    setupCardAbilities(ability) {
        this.action({
            title: 'Gain 2 fate or 2 honor',
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Each player gains 2 fate': ability.actions.gainFate(context => ({
                        amount: 2,
                        target: context.game.getPlayers()
                    })),
                    'Each player gains 2 honor': ability.actions.gainHonor(context => ({
                        amount: 2,
                        target: context.game.getPlayers()
                    }))
                }
            },
            cost: ability.costs.sacrificeSelf(),
            effect: 'give each player 2 {1}',
            effectArgs: context => context.select === 'Each player gains 2 fate' ? 'fate' : 'honor',
            gameAction: ability.actions.refillFaceup(context => ({ location: context.cardStateWhenInitiated.location }))
        });
    }
}


export default WindsweptYurt;
