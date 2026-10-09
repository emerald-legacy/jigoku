import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import * as GameActions from '../../GameActions/GameActions.js';
import { EventName, AbilityType, RestrictionType } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';

class DisplayOfPower extends DrawCard {
    static id = 'display-of-power';

    setupCardAbilities() {
        this.reaction('Cancel opponent\'s ring effect and claim and resolve the ring')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictUnopposed
            })
            .handler((context) => {
                this.game.onceTriggerWindow(EventName.OnResolveConflictRing, AbilityType.WouldInterrupt, (event) => {
                    this.onResolveConflictRing(event, context);
                });
            })
            .chatText('resolve and claim the ring when the ring effect resolves')
            .cannotBeMirrored();
    }

    onResolveConflictRing(event: GameEvent<EventName.OnResolveConflictRing>, context: AbilityContext) {
        if(event.cancelled) {
            return;
        }
        this.game.addMessage(msg`${context.source} cancels the ring effect and ${context.player} may resolve it and then claims it`);
        const conflict = this.game.currentConflict;
        if(!conflict) {
            return;
        }
        const ring = conflict.ring;
        const window = event.window;
        if(!ring || !window) {
            return;
        }
        window.addEvent(GameActions.resolveConflictRing().getEvent(ring, context));

        if(context.player.checkRestrictions(RestrictionType.ClaimRings, context)) {
            window.addEvent(this.game.getEvent(EventName.OnClaimRing, { player: context.player, ring:ring, conflict: event.conflict }, () => ring.claimRing(context.player)));
        }
        event.cancel();
    }
}


export default DisplayOfPower;
