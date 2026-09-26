import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import { CardType, Duration, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ToShowThePath extends DrawCard {
    static id = 'to-show-the-path';

    public setupCardAbilities() {
        this.action('Target unit costs more fate to target')
            .condition((context) =>
                context.player.cardsInPlay.some(
                    (card) => card.hasTrait('monk') || card.hasTrait('shugenja')
                ))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => !card.hasTrait('monk') && !card.hasTrait('shugenja')
            }, AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player.opponent,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.playerFateCostToTargetCard({
                    amount: 1,
                    match: (card: BaseCard) =>
                        card === context.target ||
                            context.target.attachments.some((attachment: BaseCard) => attachment === card)
                })
            })))
            .effect('make {1} pay 1 additional fate as a cost whenever they target {0} or its attachments with a card ability until the end of the phase', (context) => [context.source.controller.opponent]);
    }
}
