import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { msg } from '../../GameChat.js';

class JadeTalisman extends DrawCard {
    static id = 'jade-talisman';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.wouldInterrupt('Cancel a ring effect')
            .when({
                onMoveFate: (event, context) => event.context?.source.isRing() && event.origin === context.source.parentCharacter && (event.fate ?? 0) > 0,
                onCardHonored: (event, context) => event.card === context.source.parentCharacter && event.context?.source.isRing(),
                onCardDishonored: (event, context) => event.card === context.source.parentCharacter && event.context?.source.isRing(),
                onCardBowed: (event, context) => event.card === context.source.parentCharacter && event.context?.source.isRing(),
                onCardReadied: (event, context) => event.card === context.source.parentCharacter && event.context?.source.isRing()
            })
            .cost(costs.sacrificeSelf())
            .cancel()
            .chatText((context) => msg`cancel the effects of the ${context.event.context.source}`);
    }
}


export default JadeTalisman;
