import { moveCard } from '../../../GameActions/GameActions.js';
import { Location, TargetMode, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { topCards } from '../../topCards.js';

export default class SenseisHeirloom extends DrawCard {
    static id = 'sensei-s-heirloom';

    override setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Bushi });

        this.reaction('Search the top of your deck for a card')
            .when({
                onCardAttached: (event, context) => event.card === context.source
            })
            .deckSearch((context) => ({
                reveal: false,
                cardsToLookAt: 2 * (context.source.parentCharacter?.printedGlory ?? 0),
                mode: TargetMode.Exactly,
                numCards: 1,
                gameAction: moveCard({ destination: Location.Hand })
            }))
            .chatText((context) => msg`look at the ${topCards(2 * (context.source.parentCharacter?.printedGlory ?? 0), context.player.conflictDeck.length)} of their conflict deck`);
    }
}
