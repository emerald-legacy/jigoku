import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HuntingFalcon extends DrawCard {
    static id = 'hunting-falcon';

    setupCardAbilities() {
        this.reaction('Look at a province')
            .when({
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            })
            .target('target', {
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.isFacedown()
            }, AbilityDsl.actions.lookAt(context => ({
                message: '{0} sees {1} in {2}',
                messageArgs: (cards) => [context.source, cards[0], cards[0].location]
            })));
    }
}


export default HuntingFalcon;
