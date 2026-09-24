import type { ResolvedAbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Phases, CardType, Location } from '../../Constants.js';
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
                cardType: CardType.Attachment,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.returnToDeck((context: ResolvedAbilityContext<DrawCard, DrawCard>) => ({
                        target: context.target,
                        destination: Location.ConflictDeck,
                        shuffle: true
                    })),
                    AbilityDsl.actions.draw((context: ResolvedAbilityContext<DrawCard, DrawCard>) => ({
                        target: context.target.owner
                    }))
                ])
            }
        });
    }
}


export default InspiredVisionary;


