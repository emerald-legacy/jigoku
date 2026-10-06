import DrawCard from '../../../DrawCard.js';
import { Decks, CardType } from '../../../Constants.js';
import { deckSearch, putIntoPlay } from '../../../GameActions/GameActions.js';

class HotSpringsProprietor extends DrawCard {
    static id = 'hot-springs-proprietor';

    setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(deckSearch({
                activePromptTitle: 'Choose a character to put into play',
                deck: Decks.DynastyDeck,
                cardCondition: (card) => card.type === CardType.Character && (card.printedCost ?? 0) <= 1,
                gameAction: putIntoPlay()
            }))
            .effect('search their dynasty deck for a character with printed cost 1 or less and put it into play');
    }
}


export default HotSpringsProprietor;
