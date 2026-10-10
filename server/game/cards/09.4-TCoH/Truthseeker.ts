import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';
import { DeckChoice } from '../DeckChoice.js';

const decks = new DeckChoice({ players: Players.Any, pile: 'deck' });

class Truthseeker extends DrawCard {
    static id = 'truthseeker';

    setupCardAbilities() {
        this.reaction('Look at top 3 cards')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose which deck to look at:'
            }, decks.choices((player, deck) => rearrangeDeck({
                target: player,
                deck,
                amount: 3,
                activePromptTitle: 'Select the card you would like to place on top of the deck'
            })))
            .chatText((context) => msg`look at the top 3 cards of ${decks.chosenName(context)}`);
    }
}


export default Truthseeker;
