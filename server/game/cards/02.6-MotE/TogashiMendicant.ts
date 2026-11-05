import DrawCard from '../../DrawCard.js';
import { DeckType, Phase } from '../../Constants.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

class TogashiMendicant extends DrawCard {
    static id = 'togashi-mendicant';

    override setupCardAbilities() {
        this.reaction('Rearrange top 3 cards of dynasty deck')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phase.Fate && context.player.dynastyDeck.length > 0
            })
            .gameAction(rearrangeDeck({ amount: 3, deck: DeckType.Dynasty }))
            .chatText((context) => msg`rearrange the ${topCards(3, context.player.dynastyDeck.length)} of their dynasty deck`);
    }
}


export default TogashiMendicant;
