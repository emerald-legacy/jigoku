import DrawCard from '../../DrawCard.js';
import { Decks, Phases } from '../../Constants.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';

class TogashiMendicant extends DrawCard {
    static id = 'togashi-mendicant';

    setupCardAbilities() {
        this.reaction('Rearrange top 3 cards of dynasty deck')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phases.Fate && context.player.dynastyDeck.length > 0
            })
            .gameAction(rearrangeDeck({ amount: 3, deck: Decks.DynastyDeck }))
            .effect('rearrange the top 3 cards of their dynasty deck');
    }
}


export default TogashiMendicant;
