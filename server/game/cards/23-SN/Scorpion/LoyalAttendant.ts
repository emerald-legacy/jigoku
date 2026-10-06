import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { lookAt, multipleContext } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { chooseCardToDiscard, randomHandCards } from '../../randomHandCards.js';

export default class LoyalAttendant extends DrawCard {
    static id = 'loyal-attendant';

    public setupCardAbilities() {
        this.conflictAction('Discard a card')
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.attachments.filter(a => a.controller === context.player).length > 0
            })
            .gameAction(multipleContext((context) => {
                const cardNumber = context.target.attachments.length;
                const cards = cardNumber ? randomHandCards(context.player.opponent, cardNumber) : [context.source];
                return {
                    gameActions: [
                        lookAt(() => ({
                            target: cards
                        })),
                        chooseCardToDiscard(cards)
                    ]
                };
            }))
            .effect('look at {2} random cards in {1}\'s hand and discard one of them', (context) => [
                context.player.opponent,
                context.target.attachments.length
            ])
            .max(AbilityDsl.limit.perConflict(1));
    }
}
