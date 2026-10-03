import DrawCard from '../../DrawCard.js';
import { Decks, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FavorableDealbroker extends DrawCard {
    static id = 'favorable-dealbroker';

    setupCardAbilities() {
        this.reaction('Put a character into play')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a character to put into play ',
                deck: Decks.DynastyDeck,
                cardCondition: (card) => card.type === CardType.Character && card.printedCost === 1,
                gameAction: AbilityDsl.actions.putIntoPlay()
            }))
            .effect('search their dynasty deck for a character that costs 1 and put it into play');
    }
}


export default FavorableDealbroker;
