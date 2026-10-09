import DrawCard from '../../DrawCard.js';
import { Phase, Players, RestrictionType } from '../../Constants.js';
import { playerCannot } from '../../effects.js';
import { draw, loseHonor, multiple } from '../../GameActions/GameActions.js';

class BayushiShoju2 extends DrawCard {
    static id = 'bayushi-shoju-2';

    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            effect: playerCannot(RestrictionType.HaveImperialFavor)
        });

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
    }
}


export default BayushiShoju2;
