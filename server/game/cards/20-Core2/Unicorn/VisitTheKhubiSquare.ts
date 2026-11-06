import { ProvinceCard } from '../../../ProvinceCard.js';
import { cheapCharacterSearch } from '../../cheapCharacterSearch.js';
import { msg } from '../../../GameChat.js';
import { topCards } from '../../topCards.js';

export default class VisitTheKhubiSquare extends ProvinceCard {
    static id = 'visit-the-khubi-square';

    override setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .deckSearch(cheapCharacterSearch())
            .chatText((context) => msg`search the ${topCards(5, context.player.dynastyDeck.length)} of their dynasty deck for a character that costs 2 or less and put it into play`);
    }
}
