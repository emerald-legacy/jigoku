import AbilityDsl from '../../../abilitydsl.js';
import { EventName, AbilityType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { Event } from '../../../Events/Event.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import { moveHoldingAction, otherHoldingsInSameProvince } from '../../moveHolding.js';

export default class StormFromSakkaku extends DrawCard {
    static id = 'storm-from-sakkaku';

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([
            { [`${EventName.OnResolveRingElement}:${AbilityType.WouldInterrupt}`]: 'cancelRingEffect' }
        ]);

        moveHoldingAction(this)
            .then(() => ({
                gameAction: AbilityDsl.actions.discardCard((context) => ({
                    target: otherHoldingsInSameProvince(context)
                })),
                message: 'The {1} {3}',
                messageArgs: (context) => [
                    otherHoldingsInSameProvince(context).length > 0
                        ? 'is angry and discards the holdings that they find in the province'
                        : 'calms down'
                ]
            }));
    }

    public cancelRingEffect(event: Event) {
        if(event.context?.game.currentConflict && this.isInConflictProvince() && this.isFaceup() && !event.cancelled) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}
