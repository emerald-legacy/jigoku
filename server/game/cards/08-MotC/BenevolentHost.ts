import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, Players, CardType } from '../../Constants.js';

class BenevolentHost extends DrawCard {
    static id = 'benevolent-host';

    setupCardAbilities() {
        this.reaction('Put a Courtier into play')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('courtier')
            }, AbilityDsl.actions.putIntoPlay())
            .then(context => ({
                gameAction: AbilityDsl.actions.placeFate({ target: context.target.costLessThan(3) ? context.target : [] })
            }));
    }
}


export default BenevolentHost;
