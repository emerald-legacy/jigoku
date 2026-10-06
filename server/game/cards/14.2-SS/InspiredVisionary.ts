import DrawCard from '../../DrawCard.js';
import { Phases, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { draw, returnToDeck, sequential } from '../../GameActions/GameActions.js';

class InspiredVisionary extends DrawCard {
    static id = 'inspired-visionary';

    setupCardAbilities() {
        this.reaction('Bow to discard an attachment')
            .when({
                onPhaseStarted: event => event.phase === Phases.Fate
            })
            .cost(AbilityDsl.costs.bowSelf())
            .target({
                cardType: CardType.Attachment
            }, sequential([
                returnToDeck((context) => ({
                    target: context.target,
                    destination: Location.ConflictDeck,
                    shuffle: true
                })),
                draw((context) => ({
                    target: context.target.owner
                }))
            ]));
    }
}


export default InspiredVisionary;


