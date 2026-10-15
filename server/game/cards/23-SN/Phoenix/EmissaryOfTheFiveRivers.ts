import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { honor, ready } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';

export default class EmissaryOfTheFiveRivers extends DrawCard {
    static id = 'emissary-of-the-five-rivers';

    setupCardAbilities() {
        this.reaction('Honor a spirit')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('spirit')
            }, honor());

        this.action('Ready a spirit')
            .cost(costs.discardCard())
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('spirit')
            }, ready());
    }
}
