import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class UtakuTomoe extends DrawCard {
    static id = 'utaku-tomoe';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character or gain honor',
            when: {
                onReturnHome: (event, context) =>
                    !!event.conflict &&
                    event.conflict.attackingPlayer === context.player.opponent &&
                    event.card === context.source
            },
            gameAction: AbilityDsl.actions.conditional((context: any) => ({
                condition: context.event.conflict?.winner === context.source.controller,
                trueGameAction: AbilityDsl.actions.gainHonor({ target: context.player, amount: 2 }),
                falseGameAction: AbilityDsl.actions.ready({ target: context.source })
            }))
        });
    }
}
