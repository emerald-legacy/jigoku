import DrawCard from '../../../DrawCard.js';
import { Decks, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class HotSpringsProprietor extends DrawCard {
    static id = 'hot-springs-proprietor';

    setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a character to put into play',
                deck: Decks.DynastyDeck,
                cardCondition: (card) => card.type === CardType.Character && (card.printedCost ?? 0) <= 1,
                gameAction: AbilityDsl.actions.putIntoPlay()
            }))
            .effect('search their dynasty deck for a character with printed cost 1 or less and put it into play');
    }
}


export default HotSpringsProprietor;
