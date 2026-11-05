import { Location } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

export default class SecretCache extends ProvinceCard {
    static id = 'secret-cache';

    override setupCardAbilities() {
        this.reaction('Look at top 5 cards')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .deckSearch({
                cardsToLookAt: 5,
                reveal: false,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText((context) => msg`look at the ${topCards(5, context.player.conflictDeck.length)} of their conflict deck`);
    }
}
