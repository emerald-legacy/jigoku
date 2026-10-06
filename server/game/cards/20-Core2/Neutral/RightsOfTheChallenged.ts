import { Players } from '../../../Constants.js';
import { placeFateOnRing, sequential, switchConflictElement } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class RightsOfTheChallenged extends DrawCard {
    static id = 'rights-of-the-challenged';

    public setupCardAbilities() {
        this.reaction('Force attacker to attack with another ring')
            .when({
                onConflictStarted: (_, context) => context.player.isDefendingPlayer()
            })
            .ringTarget({
                activePromptTitle: 'Choose a ring to use instead',
                player: Players.Opponent,
                ringCondition: (ring) => ring.isUnclaimed() && !ring.isRemovedFromGame()
            }, sequential([
                placeFateOnRing((context) => ({
                    origin: context.ring,
                    target: context.game.currentConflict?.ring,
                    amount: context.ring?.fate
                })),
                switchConflictElement()
            ]))
            .effect('move all fate from the {0} and switch it with the contested ring');
    }
}
