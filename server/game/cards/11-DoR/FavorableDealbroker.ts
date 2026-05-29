import DrawCard from '../../DrawCard.js';
import { Decks, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FavorableDealbroker extends DrawCard {
    static id = 'favorable-dealbroker';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'search their dynasty deck for a character that costs 1 and put it into play',
            gameAction: AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a character to put into play ',
                deck: Decks.DynastyDeck,
                cardCondition: (card) => card.type === CardTypes.Character && card.printedCost === 1,
                gameAction: AbilityDsl.actions.putIntoPlay()
            })
        });
    }
}


export default FavorableDealbroker;
