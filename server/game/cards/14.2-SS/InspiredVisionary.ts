import DrawCard from '../../DrawCard.js';
import { Phase, CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { draw, returnToDeck, sequential } from '../../GameActions/GameActions.js';

class InspiredVisionary extends DrawCard {
    static id = 'inspired-visionary';

    override setupCardAbilities() {
        this.reaction('Bow to shuffle an attachment into its owner\'s deck')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Fate
            })
            .cost(costs.bowSelf())
            .target({
                cardType: CardType.Attachment
            }, sequential([
                returnToDeck((context) => ({
                    target: context.target,
                    shuffle: true
                })),
                draw((context) => ({
                    target: context.target.owner
                }))
            ]));
    }
}


export default InspiredVisionary;


