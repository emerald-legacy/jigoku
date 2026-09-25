import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';

export default class EmissaryOfTheFiveRivers extends DrawCard {
    static id = 'emissary-of-the-five-rivers';

    setupCardAbilities() {
        this.reaction('Honor a spirit')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('spirit')
            }, AbilityDsl.actions.honor());

        this.action('Ready a spirit')
            .cost(AbilityDsl.costs.discardCard())
            .target('target', {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('spirit')
            }, AbilityDsl.actions.ready());
    }
}
