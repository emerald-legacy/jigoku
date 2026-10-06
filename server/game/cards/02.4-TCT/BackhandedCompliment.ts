import DrawCard from '../../DrawCard.js';
import { draw, loseHonor, multiple } from '../../GameActions/GameActions.js';
import { playerChoices } from '../playerChoices.js';

class BackhandedCompliment extends DrawCard {
    static id = 'backhanded-compliment';

    setupCardAbilities() {
        this.action('Select a player to lose an honor and draw a card')
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (player) => multiple([
                loseHonor({ target: player }),
                draw({ target: player })
            ])))
            .effect('make {1} lose an honor and draw a card', context => context.select === context.player.name ? context.player : (context.player.opponent ?? ''));
    }
}


export default BackhandedCompliment;
