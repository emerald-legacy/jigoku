import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
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
                cardCondition: (card, context) => card.isParticipating() && card.attachments.filter((a) => a.controller === context.player).length > 0
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
            .chatText((context) => msg`look at ${context.target.attachments.length} random cards in ${context.player.opponent}'s hand and discard one of them`)
            .max(perConflict(1));
    }
}
