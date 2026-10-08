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
            .chatText('make {1}{2} draw 3 cards', context => {
                const player = context.select === context.player.name ? context.player : context.player.opponent;
                if(!player) {
                    return [context.player, ''];
                }
                const handSize = player.hand.length;
                const amountDiscarded = Math.min(3, handSize);
                return [player, amountDiscarded > 0 ? ' discard ' + amountDiscarded + ' cards and' : ''];
            });
    }
}


export default MasterWhisperer;
