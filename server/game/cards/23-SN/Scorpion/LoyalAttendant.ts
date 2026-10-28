import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { lookAt, multiple } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { chooseCardToDiscard, randomHandCards } from '../../randomHandCards.js';

export default class LoyalAttendant extends DrawCard {
    static id = 'loyal-attendant';

    public override setupCardAbilities() {
        this.conflictAction('Discard a card')
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card.attachments.filter((a) => a.controller === context.player).length > 0
            })
            .gameAction(multiple((context) => {
                const cardNumber = context.target.attachments.length;
                const cards = cardNumber ? randomHandCards(context.player.opponent, cardNumber) : [];
                return [
                    lookAt(() => ({
                        target: cards
                    })),
                    chooseCardToDiscard(cards)
                ];
            }))
            .chatText((context) => {
                const amount = context.target.attachments.length;
                return msg`look at ${amount} random card${amount === 1 ? '' : 's'} in ${context.player.opponent}'s hand and discard one of them`;
            })
            .max(perConflict(1));
    }
}
