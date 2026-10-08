import { msg } from '../../../GameChat.js';
import { draw, loseHonor, multiple } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { playerChoices } from '../../playerChoices.js';

export default class BackhandedCompliment2 extends DrawCard {
    static id = 'backhanded-compliment-2';

    setupCardAbilities() {
        this.action('Select a player to lose an honor and draw a card')
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (target) => multiple([
                loseHonor({ target }),
                draw({ target })
            ])))
            .chatText((context) => msg`make ${(context.select === context.player.name ? context.player : context.player.opponent)} lose an honor and draw a card`);
    }
}
