import { CardType, Players } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { bow } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class ItinerantPhilosopher extends DrawCard {
    static id = 'itinerant-philosopher';

    setupCardAbilities() {
        this.action('Bow a character')
            .condition((context) => context.source.isParticipating())
            .cost(costs.discardImperialFavor())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && card.attachments.length > 0
            }, bow());
    }
}
