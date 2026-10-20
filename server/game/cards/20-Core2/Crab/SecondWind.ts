import { CardType, Location, Players } from '../../../Constants.js';
import {
    atEndOfConflict,
    multiple,
    putIntoConflict,
    returnToDeck,
    selectCard
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { msg } from '../../../GameChat.js';

function cardsToDiscard(context: AbilityContext) {
    return context.player.dynastyDeck.slice(0, 4);
}

export default class SecondWind extends DrawCard {
    static id = 'second-wind';

    public override setupCardAbilities() {
        this.conflictAction('put a character from your discard pile into play')
            .discardCard((context) => ({ target: cardsToDiscard(context) }))
            .chatText((context) => msg`find a character to put into play. ${context.player} discards ${cardsToDiscard(context)}`)
            .then()
            .gameAction(selectCard({
                location: Location.DynastyDiscardPile,
                cardType: CardType.Character,
                cardCondition: (card) => !card.isUnique(),
                controller: Players.Self,
                targets: true,
                gameAction: multiple([
                    putIntoConflict(),
                    atEndOfConflict(() => ({
                        gameAction: returnToDeck({ bottom: true })
                    }))
                ]),
                message: (context, card) => msg`${context.player} puts ${card} into play. ${card} will be put on the bottom of the deck if it's still in play by the end of the conflict`
            }));
    }
}
