import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import Ring from '../../Ring.js';
import { msg } from '../../GameChat.js';

class JadeTalisman extends DrawCard {
    static id = 'jade-talisman';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.wouldInterrupt('Cancel a ring effect')
            .when({
                onMoveFate: (event, context) => event.context?.source instanceof Ring && event.origin === context.source.parentCharacter && (event.fate ?? 0) > 0,
                onCardHonored: (event, context) => event.card === context.source.parentCharacter && event.context?.source instanceof Ring,
                onCardDishonored: (event, context) => event.card === context.source.parentCharacter && event.context?.source instanceof Ring,
                onCardBowed: (event, context) => event.card === context.source.parentCharacter && event.context?.source instanceof Ring,
                onCardReadied: (event, context) => event.card === context.source.parentCharacter && event.context?.source instanceof Ring
            })
            .cost(costs.sacrificeSelf())
            .cancel()
            .chatText((context) => msg`cancel the effects of the ${context.event.context.source}`);
    }
}


export default JadeTalisman;
