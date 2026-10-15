import DrawCard from '../../DrawCard.js';
import { DeckType, Phase } from '../../Constants.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';

class HirumaKogoe extends DrawCard {
    static id = 'hiruma-kogoe';

    setupCardAbilities() {
        this.reaction('Rearrange top 3 cards of your conflict deck')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phase.Draw && context.player.opponent && context.player.honor < context.player.opponent.honor
            })
            .gameAction(rearrangeDeck({ amount: 3, deck: DeckType.Conflict }))
            .chatText('rearrange the top 3 cards of their conflict deck');
    }
}


export default HirumaKogoe;
