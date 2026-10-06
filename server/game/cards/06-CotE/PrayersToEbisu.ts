import DrawCard from '../../DrawCard.js';
import { draw, gainHonor, loseHonor, multiple } from '../../GameActions/GameActions.js';

class PrayersToEbisu extends DrawCard {
    static id = 'prayers-to-ebisu';

    setupCardAbilities() {
        this.action('Re-balance honor and draw a card')
            .gameAction(multiple([
                loseHonor((context) => ({
                    target: context.game.getPlayers().filter((player) => player.honor >= 19),
                    amount: 4
                })),
                gainHonor((context) => ({
                    target: context.game.getPlayers().filter((player) => player.honor <= 6),
                    amount: 4
                })),
                draw((context) => ({
                    target: context.player
                }))
            ]))
            .effect('draw a card, make each player with 19 or more honor lose 4 honor, and make each player with 6 or fewer honor gain 4 honor');
    }
}


export default PrayersToEbisu;
