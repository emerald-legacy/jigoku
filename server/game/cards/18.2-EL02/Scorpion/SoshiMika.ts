import DrawCard from '../../../DrawCard.js';
import { Phase } from '../../../Constants.js';
import { draw, flipImperialFavor, loseHonor, multiple } from '../../../GameActions/GameActions.js';

class SoshiMika extends DrawCard {
    static id = 'soshi-mika';

    setupCardAbilities() {
        this.forcedReaction('After the conflict phase begins')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Conflict
            })
            .gameAction(multiple([
                loseHonor((context) => ({
                    target: context.game.getPlayers()
                })),
                draw((context) => ({
                    target: context.game.getPlayers(),
                    amount: 2
                }))
            ]))
            .chatText('have each player lose an honor and draw two cards');

        this.action('Flip the Imperial Favor')
            .gameAction(flipImperialFavor((context) => ({
                target: context.player.imperialFavor ? context.player : context.player.opponent
            })));
    }
}


export default SoshiMika;
