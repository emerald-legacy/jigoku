import DrawCard from '../../drawcard.js';

class IgnobleEnforcers extends DrawCard {
    static id = 'ignoble-enforcers';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Place additional fate on this character',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            cost: ability.costs.variableHonorCost(() => 3),
            effect: 'place {1} fate on {0}',
            effectArgs: context => context.costs.variableHonorCost,
            gameAction: ability.actions.placeFate(context => ({ amount: context.costs.variableHonorCost }))
        });
    }
}


export default IgnobleEnforcers;
