import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { playerChoices } from '../playerChoices.js';

class BackhandedCompliment extends DrawCard {
    static id = 'backhanded-compliment';

    setupCardAbilities() {
        this.action('Select a player to lose an honor and draw a card')
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (player) => AbilityDsl.actions.multiple([
                AbilityDsl.actions.loseHonor({ target: player }),
                AbilityDsl.actions.draw({ target: player })
            ])))
            .effect('make {1} lose an honor and draw a card', context => context.select === context.player.name ? context.player : (context.player.opponent ?? ''));
    }
}


export default BackhandedCompliment;
