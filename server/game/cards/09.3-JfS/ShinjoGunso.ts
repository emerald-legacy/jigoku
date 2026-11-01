import { PlayType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { cheapCharacterSearch } from '../cheapCharacterSearch.js';

export default class ShinjoGunso extends DrawCard {
    static id = 'shinjo-gunso';

    override setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onCardPlayed: (event, context) =>
                    event.playType === PlayType.PlayFromProvince &&
                    event.card === context.source &&
                    !!event.originalLocation &&
                    context.game.getProvinceArray().some((location) => location === event.originalLocation)
            })
            .deckSearch(cheapCharacterSearch())
            .chatText('search the top 5 cards of their dynasty deck for a character that costs 2 or less and put it into play');
    }
}
