import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import * as GameActions from '../../GameActions/GameActions.js';
import { EventName, AbilityType } from '../../Constants.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import type EventWindow from '../../Events/EventWindow.js';

class DisplayOfPower extends DrawCard {
    static id = 'display-of-power';

    setupCardAbilities() {
        this.reaction({
            title: 'Cancel opponent\'s ring effect and claim and resolve the ring',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictUnopposed
            },
            cannotBeMirrored: true,
            effect: 'resolve and claim the ring when the ring effect resolves',
            handler: context => {
                this.game.once(EventName.OnResolveConflictRing + ':' + AbilityType.WouldInterrupt, (event: unknown) => this.onResolveConflictRing(event as GameEvent<EventName.OnResolveConflictRing>, context));
            }
        });
    }

    onResolveConflictRing(event: GameEvent<EventName.OnResolveConflictRing>, context: AbilityContext) {
        if(event.cancelled) {
            return;
        }
        this.game.addMessage('{0} cancels the ring effect and {1} may resolve it and then claims it', context.source, context.player);
        const conflict = this.game.currentConflict;
        if(!conflict) {
            return;
        }
        const ring = conflict.ring;
        if(!ring) {
            return;
        }
        (event.window as EventWindow).addEvent(GameActions.resolveConflictRing().getEvent(ring, context));

        if(context.player.checkRestrictions('claimRings', context)) {
            (event.window as EventWindow).addEvent(this.game.getEvent(EventName.OnClaimRing, { player: this.controller, ring:ring, conflict: event.conflict }, () => ring.claimRing(context.player)));
        }
        event.cancel();
    }
}


export default DisplayOfPower;
