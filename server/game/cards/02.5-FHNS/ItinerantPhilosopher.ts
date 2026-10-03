import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class ItinerantPhilosopher extends DrawCard {
    static id = 'itinerant-philosopher';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(AbilityDsl.costs.discardImperialFavor())
            .condition((context) => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating() && card.attachments.length > 0
            }, AbilityDsl.actions.bow());
    }
}
