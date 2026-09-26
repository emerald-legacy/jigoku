import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class SharpenedTsuruhashi extends DrawCard {
    static id = 'sharpened-tsuruhashi';

    setupCardAbilities() {
        this.interrupt('Return Sharpened Tsuruhashi to your hand')
            .when({
                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>, context) => event.isSacrifice && event.card === context.source.parentCharacter
            })
            .gameAction(AbilityDsl.actions.returnToHand(context => ({
                target: context.source
            })))
            .effect('return it to their hand.');
    }
}


export default SharpenedTsuruhashi;

