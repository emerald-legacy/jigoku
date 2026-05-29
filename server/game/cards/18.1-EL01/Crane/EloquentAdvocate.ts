import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Locations } from '../../../Constants.js';

class EloquentAdvocate extends DrawCard {
    static id = 'eloquent-advocate';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 2 cards of conflict deck',
            effect: 'look at the top two cards of their conflict deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() &&
                                                   event.conflict.conflictType === 'political'
            },
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 2,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                }),
                shuffle: false,
                reveal: false,
                placeOnBottomInRandomOrder: true
            })
        });
    }
}

export default EloquentAdvocate;

