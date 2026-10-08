import DrawCard from '../../DrawCard.js';
import { Players, Location, CardType } from '../../Constants.js';
import { cancel, putIntoPlay } from '../../GameActions/GameActions.js';

class Leniency extends DrawCard {
    static id = 'leniency';

    setupCardAbilities() {
        this.wouldInterrupt('Put a two cost or lower character into play instead of resolving the ring effects')
            .when({
                onResolveRingElement: (event, context) => event.player === context.player
            })
            .target({
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => (card.printedCost ?? 0) < 3
            }, cancel({
                replacementGameAction: putIntoPlay()
            }))
            .chatText('put {0} into play instead of resolving the ring effect')
            .cannotBeMirrored();
    }
}


export default Leniency;
