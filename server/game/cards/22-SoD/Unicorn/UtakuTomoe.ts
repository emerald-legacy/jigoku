import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class UtakuTomoe extends DrawCard {
    static id = 'utaku-tomoe';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character or gain honor',
            when: {
                onReturnHome: (event, context) => {
                    return event.conflict.attackingPlayer === context.player.opponent && event.card === context.source;
                }
            },
            gameAction: AbilityDsl.actions.conditional(context => ({
                condition: context.event.conflict.winner === context.source.controller,
                trueGameAction: AbilityDsl.actions.gainHonor({ target: context.player, amount: 2 }),
                falseGameAction: AbilityDsl.actions.ready({ target: context.source }),
            }))
        });
    }
}
