import DrawCard from '../../DrawCard.js';
import { Decks, Phases } from '../../Constants.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';

class HirumaKogoe extends DrawCard {
    static id = 'hiruma-kogoe';

    setupCardAbilities() {
        this.reaction('Rearrange top 3 cards of your conflict deck')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phases.Draw && context.player.opponent && context.player.honor < context.player.opponent.honor
            })
            .gameAction(rearrangeDeck({ amount: 3, deck: Decks.ConflictDeck }))
            .effect('rearrange the top 3 cards of their conflict deck');
    }
}


export default HirumaKogoe;
