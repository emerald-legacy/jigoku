import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MarkOfShame extends DrawCard {
    static id = 'mark-of-shame';

    setupCardAbilities() {
        this.reaction('Dishonor attached character')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.dishonor(context => ({ target: context.source.parentCharacter ?? [] })),
                AbilityDsl.actions.dishonor(context => ({ target: context.source.parentCharacter ?? [] }))
            ]))
            .effect('dishonor {1}, then dishonor it again', context => context.source.parentCharacter);
    }
}


export default MarkOfShame;
