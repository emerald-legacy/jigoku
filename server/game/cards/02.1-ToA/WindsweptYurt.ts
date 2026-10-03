import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class WindsweptYurt extends DrawCard {
    static id = 'windswept-yurt';

    setupCardAbilities() {
        this.action('Gain 2 fate or 2 honor')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .select('target', {

            }, {
                'Each player gains 2 fate': AbilityDsl.actions.gainFate((context) => ({
                    amount: 2,
                    target: context.game.getPlayers()
                })),
                'Each player gains 2 honor': AbilityDsl.actions.gainHonor((context) => ({
                    amount: 2,
                    target: context.game.getPlayers()
                }))
            })
            .gameAction(AbilityDsl.actions.refillFaceup((context) => ({ location: context.cardStateWhenInitiated?.location ?? [] })))
            .effect('give each player 2 {1}', context => context.select === 'Each player gains 2 fate' ? 'fate' : 'honor');
    }
}


export default WindsweptYurt;
