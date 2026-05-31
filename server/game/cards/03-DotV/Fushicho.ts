import DrawCard from '../../DrawCard.js';
import { Locations, Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Fushicho extends DrawCard {
    static id = 'fushicho';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.interrupt({
            title: 'Resurrect a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                location: Locations.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: card => card.isFaction('phoenix'),
                gameAction: ability.actions.putIntoPlay({ fate: 1 })
            }
        });
    }
}


export default Fushicho;
