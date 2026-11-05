import DrawCard from '../../DrawCard.js';
import { chosenDiscard, gainHonor, loseHonor, multiple, noAction, takeHonor } from '../../GameActions/GameActions.js';
import { Players } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import { honorTransferMessage } from '../honorTransferMessage.js';
import { playerChoices } from '../playerChoices.js';

const NO_HONOR = 'Don\'t give honor';

class ChancellorsAide extends DrawCard {
    static id = 'chancellor-s-aide';

    override setupCardAbilities() {
        this.interrupt('Player discards a card')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .selectFrom({
                name: 'myPlayer',
                targets: true
            }, (context) => playerChoices(context.player, (player) => chosenDiscard({ target: player })))
            // Ruling #1069: the opponent gives 1 honor at the same time as they choose a player.
            .selectFrom({
                name: 'oppPlayer',
                targets: true,
                player: Players.Opponent,
                activePromptTitle: 'Give 1 honor to choose a player?',
                condition: (context) => !!context.player.opponent &&
                    loseHonor().canAffect(context.player.opponent, context) && gainHonor().canAffect(context.player, context)
            }, (context) => ({
                ...(context.player.opponent ? playerChoices(context.player.opponent, (player) => multiple([takeHonor({ target: context.player.opponent }), chosenDiscard({ target: player })])) : {}),
                [NO_HONOR]: noAction()
            }))
            .chatText((context) => {
                const theirs = context.selects.oppPlayer?.choice;
                const chosen = theirs && theirs !== NO_HONOR ? { name: theirs } : undefined;
                return msg`make ${context.selects.myPlayer.choice} discard 1 card${honorTransferMessage(context, chosen, (player) => msg`make ${player.name} discard 1 card`)}`;
            })
            .cannotTargetFirst()
            .firstPlayerChoosesFirst();
    }
}

export default ChancellorsAide;
