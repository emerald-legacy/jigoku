import DrawCard from '../../DrawCard.js';
import { putIntoPlay } from '../../GameActions/GameActions.js';
import { Location, Players, CardType, Trait } from '../../Constants.js';

class BenevolentHost extends DrawCard {
    static id = 'benevolent-host';

    override setupCardAbilities() {
        this.reaction('Put a Courtier into play')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Courtier)
            }, putIntoPlay())
            .then()
            .placeFate((context) => ({ target: context.target.costLessThan(3) ? context.target : [] }));
    }
}


export default BenevolentHost;
