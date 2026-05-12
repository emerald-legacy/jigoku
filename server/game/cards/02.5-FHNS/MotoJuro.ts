import DrawCard from '../../drawcard';

class MotoJuro extends DrawCard {
    static id = 'moto-juro';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character to the conflict or home from the conflict',
            limit: ability.limit.perRound(2),
            gameAction: ability.actions.conditional({
                condition: (context) => context.source.isParticipating(),
                trueGameAction: ability.actions.sendHome(context => ({ target: context.source })),
                falseGameAction: ability.actions.moveToConflict(context => ({ target: context.source }))
            })
        });
    }
}


export default MotoJuro;
