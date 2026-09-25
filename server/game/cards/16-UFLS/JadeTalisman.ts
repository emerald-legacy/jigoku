import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class JadeTalisman extends DrawCard {
    static id = 'jade-talisman';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.wouldInterrupt('Cancel a ring effect')
            .when({
                onMoveFate: (event, context) => (event.context?.source.type as string) === 'ring' && event.origin === context.source.parentCharacter && event.fate > 0,
                onCardHonored: (event, context) => event.card === context.source.parentCharacter && (event.context?.source.type as string) === 'ring',
                onCardDishonored: (event, context) => event.card === context.source.parentCharacter && (event.context?.source.type as string) === 'ring',
                onCardBowed: (event, context) => event.card === context.source.parentCharacter && (event.context?.source.type as string) === 'ring',
                onCardReadied: (event, context) => event.card === context.source.parentCharacter && (event.context?.source.type as string) === 'ring'
            })
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(AbilityDsl.actions.cancel())
            .effect('cancel the effects of the {1}', context => [(context.event.context).source]);
    }
}


export default JadeTalisman;
