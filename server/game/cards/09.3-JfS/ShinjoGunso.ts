import { PlayType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { cheapCharacterSearch } from '../cheapCharacterSearch.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

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
            .chatText((context) => msg`search the ${topCards(5, context.player.dynastyDeck.length)} of their dynasty deck for a character that costs 2 or less and put it into play`);
    }
}
