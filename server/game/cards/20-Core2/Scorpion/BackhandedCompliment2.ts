import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { playerChoices } from '../../playerChoices.js';

export default class BackhandedCompliment2 extends DrawCard {
    static id = 'backhanded-compliment-2';

    setupCardAbilities() {
        this.action('Select a player to lose an honor and draw a card')
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (target) => AbilityDsl.actions.multiple([
                AbilityDsl.actions.loseHonor({ target }),
                AbilityDsl.actions.draw({ target })
            ])))
            .effect('make {1} lose an honor and draw a card', (context) => (context.select === context.player.name ? context.player : context.player.opponent));
    }
}
