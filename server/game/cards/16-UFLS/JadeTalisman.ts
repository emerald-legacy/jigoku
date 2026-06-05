import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class JadeTalisman extends DrawCard {
    static id = 'jade-talisman';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.wouldInterrupt({
            title: 'Cancel a ring effect',
            when: {
                onMoveFate: (event, context) => (event.context?.source.type as string) === 'ring' && event.origin === context.source.parent && event.fate > 0,
                onCardHonored: (event, context) => event.card === context.source.parent && (event.context?.source.type as string) === 'ring',
                onCardDishonored: (event, context) => event.card === context.source.parent && (event.context?.source.type as string) === 'ring',
                onCardBowed: (event, context) => event.card === context.source.parent && (event.context?.source.type as string) === 'ring',
                onCardReadied: (event, context) => event.card === context.source.parent && (event.context?.source.type as string) === 'ring'
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.cancel(),
            effect: 'cancel the effects of the {1}',
            effectArgs: context => [(context.event.context as AbilityContext).source]
        });
    }
}


export default JadeTalisman;
