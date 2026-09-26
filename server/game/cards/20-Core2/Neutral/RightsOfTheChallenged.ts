import { Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class RightsOfTheChallenged extends DrawCard {
    static id = 'rights-of-the-challenged';

    public setupCardAbilities() {
        this.reaction('Force attacker to attack with another ring')
            .when({
                onConflictStarted: (_, context) => context.player.isDefendingPlayer()
            })
            .ringTarget('target', {
                activePromptTitle: 'Choose a ring to use instead',
                player: Players.Opponent,
                ringCondition: (ring) => ring.isUnclaimed() && !ring.isRemovedFromGame()
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.placeFateOnRing((context) => ({
                    origin: context.ring,
                    target: context.game.currentConflict?.ring,
                    amount: context.ring?.fate
                })),
                AbilityDsl.actions.switchConflictElement()
            ]))
            .effect('move all fate from the {0} and switch it with the contested ring');
    }
}
