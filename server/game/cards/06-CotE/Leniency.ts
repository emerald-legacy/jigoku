import DrawCard from '../../DrawCard.js';
import { Players, Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Leniency extends DrawCard {
    static id = 'leniency';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Put a two cost or lower character into play into play instead of resolving the ring effects',
            when: {
                onResolveRingElement: (event, context) => event.player === context.player
            },
            target: {
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: card => card.printedCost < 3,
                gameAction: AbilityDsl.actions.cancel({
                    replacementGameAction: AbilityDsl.actions.putIntoPlay()
                })
            },
            cannotBeMirrored: true,
            effect: 'put {0} into play instead of resolving the ring effect'
        });
    }
}


export default Leniency;
