import { ProvinceCard } from '../../../ProvinceCard.js';
import { cheapCharacterSearch } from '../../cheapCharacterSearch.js';

export default class VisitTheKhubiSquare extends ProvinceCard {
    static id = 'visit-the-khubi-square';

    override setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .deckSearch(cheapCharacterSearch())
            .chatText('search the top 5 cards of their dynasty deck for a character that costs 2 or less and put it into play');
    }
}
