import DrawCard from '../../DrawCard.js';
import { Phases, Players } from '../../Constants.js';
import { playerCannot } from '../../effects.js';
import { draw, loseHonor, multiple } from '../../GameActions/GameActions.js';

class BayushiShoju2 extends DrawCard {
    static id = 'bayushi-shoju-2';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            effect: playerCannot('haveImperialFavor')
        });

        this.forcedReaction('After the conflict phase begins')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .gameAction(multiple([
                loseHonor(context => ({
                    target: context.game.getPlayers()
                })),
                draw(context => ({
                    target: context.game.getPlayers(),
                    amount: 2
                }))
            ]))
            .effect('have each player lose an honor and draw two cards');
    }
}


export default BayushiShoju2;
