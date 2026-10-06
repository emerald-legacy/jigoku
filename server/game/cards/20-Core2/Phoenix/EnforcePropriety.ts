import { CardType, Players } from '../../../Constants.js';
import { cancel, chooseAction, takeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

function countReadyShugenja(player: Player): number {
    return player.cardsInPlay.reduce(
        (sum, card) => (!card.bowed && card.hasTrait('shugenja') ? sum + 1 : sum),
        0
    );
}

export default class EnforcePropriety extends DrawCard {
    static id = 'enforce-propriety';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    event.card.type === CardType.Event &&
                    context.player.opponent &&
                    countReadyShugenja(context.player) > countReadyShugenja(context.player.opponent)
            })
            .gameAction(chooseAction((context) => ({
                player: Players.Opponent,
                activePromptTitle: 'Select one',
                options: {
                    [`Give 1 fate to ${context.player.name}`]: {
                        action: takeFate({ target: context.player.opponent }),
                        message: '{0} gives 1 fate to {2} - the fortunes will be appeased, order is maintained'
                    },
                    'Let the effects be canceled': {
                        action: cancel(),
                        message: '{0} refuses to appease the fortunes - the effects of {3} are canceled'
                    }
                },
                messageArgs: [context.player, context.event.card]
            })))
            .effect('enforce the proper protocol');
    }
}
