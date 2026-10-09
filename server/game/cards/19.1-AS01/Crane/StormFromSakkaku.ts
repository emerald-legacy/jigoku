import { discardCard } from '../../../GameActions/GameActions.js';
import { EventName, AbilityType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import type { Event } from '../../../Events/Event.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import { moveHoldingAction, otherHoldingsInSameProvince } from '../../moveHolding.js';

export default class StormFromSakkaku extends DrawCard {
    static id = 'storm-from-sakkaku';

    public setupCardAbilities() {
        new EventRegistrar(this.game).registerTriggerWindow(EventName.OnResolveRingElement, AbilityType.WouldInterrupt, (event) => this.cancelRingEffect(event));

        moveHoldingAction(this)
            .then()
            .gameAction(discardCard((context) => ({ target: otherHoldingsInSameProvince(context) })))
            .message((context) => {
                const mood = otherHoldingsInSameProvince(context).length > 0
                    ? 'is angry and discards the holdings that they find in the province'
                    : 'calms down';
                return msg`The ${context.source} ${mood}`;
            });
    }

    public cancelRingEffect(event: Event) {
        if(event.context?.game.currentConflict && this.isInConflictProvince() && this.isFaceup() && !event.cancelled) {
            event.cancel();
            this.game.addMessage(msg`${this} cancels the ring effect`);
        }
    }
}
