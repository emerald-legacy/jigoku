import DrawCard from '../../DrawCard.js';
import { Phase, CardType, Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { draw, returnToDeck, sequential } from '../../GameActions/GameActions.js';

class InspiredVisionary extends DrawCard {
    static id = 'inspired-visionary';

    setupCardAbilities() {
        this.reaction('Bow to discard an attachment')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Fate
            })
            .cost(costs.bowSelf())
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


