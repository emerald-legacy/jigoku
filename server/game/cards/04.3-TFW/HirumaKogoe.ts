import DrawCard from '../../DrawCard.js';
import { DeckType, Phase } from '../../Constants.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';
import { topCards } from '../topCards.js';

class HirumaKogoe extends DrawCard {
    static id = 'hiruma-kogoe';

    override setupCardAbilities() {
        this.reaction('Rearrange top 3 cards of your conflict deck')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Draw
            })
            .ifCondition((context) => !!context.player.opponent && context.player.honor < context.player.opponent.honor)
            .gameAction(rearrangeDeck({ amount: 3, deck: DeckType.Conflict }))
            .chatText((context) => msg`rearrange the ${topCards(3, context.player.conflictDeck.length)} of their conflict deck`);
    }
}


export default HirumaKogoe;
