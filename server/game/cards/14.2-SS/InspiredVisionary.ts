import DrawCard from '../../DrawCard.js';
import { Phases, CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class InspiredVisionary extends DrawCard {
    static id = 'inspired-visionary';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow to discard an attachment',
            when: {
                onPhaseStarted: event => event.phase === Phases.Fate
            },
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Attachment,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.returnToDeck(context => ({
                        target: context.target,
                        destination: Locations.ConflictDeck,
                        shuffle: true
                    })),
                    AbilityDsl.actions.draw(context => ({
                        target: context.target.owner
                    }))
                ])
            }
        });
    }
}


export default InspiredVisionary;


