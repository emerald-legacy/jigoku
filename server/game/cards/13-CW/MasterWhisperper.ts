import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { chosenDiscard, draw, multiple } from '../../GameActions/GameActions.js';
import { playerChoices } from '../playerChoices.js';

class MasterWhisperer extends DrawCard {
    static id = 'master-whisperer';

    setupCardAbilities() {
        this.action('Select a player to discard 3 cards and draw 3 cards')
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (player) => multiple([
                chosenDiscard({ targets: false, target: player, amount: 3 }),
                draw({ target: player, amount: 3 })
            ])))
            .chatText((context) => {
                const player = context.select === context.player.name ? context.player : context.player.opponent;
                const amountDiscarded = player ? Math.min(3, player.hand.length) : 0;
                return amountDiscarded > 0
                    ? msg`make ${player}${' discard ' + amountDiscarded + ' cards and'} draw 3 cards`
                    : msg`make ${player ?? context.player} draw 3 cards`;
            });
    }
}


export default MasterWhisperer;
