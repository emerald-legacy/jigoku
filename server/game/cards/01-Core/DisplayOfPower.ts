import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import * as GameActions from '../../GameActions/GameActions.js';
import { EventNames, AbilityTypes } from '../../Constants.js';

class DisplayOfPower extends DrawCard {
    static id = 'display-of-power';

    setupCardAbilities() {
        this.reaction({
            title: 'Cancel opponent\'s ring effect and claim and resolve the ring',
            when: {
                afterConflict: (event: any, context) => event.conflict.loser === context.player && event.conflict.conflictUnopposed
            },
            cannotBeMirrored: true,
            effect: 'resolve and claim the ring when the ring effect resolves',
            handler: context => {
                this.game.once(EventNames.OnResolveConflictRing + ':' + AbilityTypes.WouldInterrupt, (event: any) => this.onResolveConflictRing(event, context));
            }
        });
    }

    onResolveConflictRing(event: any, context: AbilityContext) {
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
        event.window.addEvent(GameActions.resolveConflictRing().getEvent(ring, context));

        if(context.player.checkRestrictions('claimRings', context)) {
            event.window.addEvent(this.game.getEvent(EventNames.OnClaimRing, { player: this.controller, ring:ring, conflict: event.conflict }, () => ring.claimRing(context.player)));
        }
        event.cancel();
    }
}


export default DisplayOfPower;
