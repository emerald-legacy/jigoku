import DrawCard from '../../drawcard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HuntingFalcon extends DrawCard {
    static id = 'hunting-falcon';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at a province',
            when: {
                onCardAttached: (event: any, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                cardCondition: (card: any) => card.isFacedown(),
                gameAction: AbilityDsl.actions.lookAt(context => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards: any) => [context.source, cards[0], cards[0].location]
                }))
            }
        });
    }
}


export default HuntingFalcon;
