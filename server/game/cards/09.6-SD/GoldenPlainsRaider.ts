import { CardType, Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class GoldenPlainsRaider extends DrawCard {
    static id = 'golden-plains-raider';

    public setupCardAbilities() {
        this.reaction({
            title: 'Discard a card in a province',
            when: {
                afterConflict: (event, context) =>
                    context.source.isAttacking() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent !== undefined
            },
            target: {
                location: Location.Provinces,
                controller: Players.Opponent,
                cardCondition: (card) => card.isFaceup() && card.type !== CardType.Province,
                gameAction: AbilityDsl.actions.discardCard()
            }
        });
    }
}
