import DrawCard from '../../DrawCard.js';
import { Location, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Fushicho extends DrawCard {
    static id = 'fushicho';

    setupCardAbilities() {
        this.interrupt('Resurrect a character')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                location: Location.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: card => card.isFaction('phoenix')
            }, AbilityDsl.actions.putIntoPlay({ fate: 1 }));
    }
}


export default Fushicho;
