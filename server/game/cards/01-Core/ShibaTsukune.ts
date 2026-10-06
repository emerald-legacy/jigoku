import type Player from '../../Player.js';
import type Ring from '../../Ring.js';
import type { Event } from '../../Events/Event.js';
import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import { resolveRingEffect } from '../../GameActions/GameActions.js';

class ShibaTsukune extends DrawCard {
    static id = 'shiba-tsukune';

    setupCardAbilities() {
        this.interrupt('Resolve 2 rings')
            .when({
                onPhaseEnded: (event) => event.phase === Phases.Conflict
            })
            .handler((context) => this.game.promptForRingSelect(context.player, {
                activePromptTitle: 'Choose a ring to resolve',
                context: context,
                ringCondition: (ring) => ring.isUnclaimed(),
                onSelect: (player, firstRing) => {
                    if(Object.values(this.game.rings).filter((ring) => ring.isUnclaimed()).length <= 1) {
                        this.resolveRing(player, firstRing);
                        return true;
                    }
                    this.game.promptForRingSelect(player, {
                        activePromptTitle: 'Choose a second ring to resolve, or click Done',
                        ringCondition: (ring) => ring.isUnclaimed() && ring !== firstRing,
                        context: context,
                        optional: true,
                        onMenuCommand: (player) => {
                            this.resolveRing(player, firstRing);
                            return true;
                        },
                        onSelect: (player, secondRing) => {
                            this.game.addMessage('{0} resolves {1}', player, [firstRing, secondRing]);
                            const events: Event[] = [];
                            resolveRingEffect({ target: [firstRing, secondRing] })
                                .addEventsToArray(events, this.game.getFrameworkContext(player));
                            this.game.openThenEventWindow(events);
                            return true;
                        }
                    });
                    return true;
                }
            }))
            .effect('resolve up to 2 ring effects');
    }

    private resolveRing(player: Player, ring: Ring) {
        this.game.addMessage('{0} resolves {1}', player, ring);
        this.game.openThenEventWindow(resolveRingEffect().getEvent(ring, this.game.getFrameworkContext(player)));
    }
}


export default ShibaTsukune;
