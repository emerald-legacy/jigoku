import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, Players, CardTypes } from '../../Constants.js';

class BenevolentHost extends DrawCard {
    static id = 'benevolent-host';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a Courtier into play',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('courtier'),
                gameAction: AbilityDsl.actions.putIntoPlay()
            },
            then: context => {
                const target = context?.target as DrawCard | undefined;
                return {
                    gameAction: AbilityDsl.actions.placeFate({ target: target?.costLessThan(3) ? target : [] })
                };
            }
        });
    }
}


export default BenevolentHost;
