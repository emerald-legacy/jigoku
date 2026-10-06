import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { cancel } from '../../GameActions/GameActions.js';
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
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(cancel())
            .effect((context) => msg`cancel the effects of the ${context.event.context.source}`);
    }
}


export default JadeTalisman;
