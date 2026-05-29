import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MarkOfShame extends DrawCard {
    static id = 'mark-of-shame';

    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor attached character',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.dishonor(context => ({ target: context.source.parent })),
                AbilityDsl.actions.dishonor(context => ({ target: context.source.parent }))
            ]),
            effect: 'dishonor {1}, then dishonor it again',
            effectArgs: context => context.source.parent
        });
    }
}


export default MarkOfShame;
