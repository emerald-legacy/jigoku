import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import * as GameActions from '../../GameActions/GameActions.js';
import { EventName, AbilityType, RestrictionType } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';

class DisplayOfPower extends DrawCard {
    static id = 'display-of-power';

    override setupCardAbilities() {
        this.reaction('Cancel opponent\'s ring effect and claim and resolve the ring')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictUnopposed
            })
            .handler((context) => {
                const onResolveConflictRing = (event: GameEvent<EventName.OnResolveConflictRing>) => this.onResolveConflictRing(event, context);
                // a ring effect cancelled before its would-interrupt window (Mountaintop Vigil) never calls it
                const onConflictFinished = () => {
                    this.game.offTriggerWindow(EventName.OnResolveConflictRing, AbilityType.WouldInterrupt, onResolveConflictRing);
                    this.game.off(EventName.OnConflictFinished, onConflictFinished);
                };
                this.game.onceTriggerWindow(EventName.OnResolveConflictRing, AbilityType.WouldInterrupt, onResolveConflictRing);
                this.game.on(EventName.OnConflictFinished, onConflictFinished);
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
