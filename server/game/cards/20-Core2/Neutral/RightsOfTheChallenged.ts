import { Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type Ring from '../../../Ring.js';

export default class RightsOfTheChallenged extends DrawCard {
    static id = 'rights-of-the-challenged';

    public setupCardAbilities() {
        this.reaction({
            title: 'Force attacker to attack with another ring',
            when: {
                onConflictStarted: (_, context) => context.player.isDefendingPlayer()
            },
            target: {
                mode: TargetMode.Ring,
                activePromptTitle: 'Choose a ring to use instead',
                player: Players.Opponent,
                ringCondition: (ring: Ring) => ring.isUnclaimed() && !ring.isRemovedFromGame(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.placeFateOnRing((context) => ({
                        origin: context.ring,
                        target: context.game.currentConflict.ring,
                        amount: context.ring.fate
                    })),
                    AbilityDsl.actions.switchConflictElement()
                ])
            },
            effect: 'move all fate from the {0} and switch it with the contested ring'
        });
    }
}
