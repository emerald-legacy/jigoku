import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { msg } from '../../GameChat.js';
import { DeckChoice } from '../DeckChoice.js';
import { discardBottomTop } from '../discardBottomTop.js';

const decks = new DeckChoice({ players: Players.Opponent, pile: 'deck' });

class MagnificentLighthouse extends DrawCard {
    static id = 'magnificent-lighthouse';

    override setupCardAbilities() {
        this.action('Look at top 3 cards')
            .selectFrom({
                activePromptTitle: 'Choose which deck to look at:'
            }, decks.choices(discardBottomTop))
            .chatText((context) => msg`look at the top 3 cards of ${decks.chosenName(context)}`);
    }
}


export default MagnificentLighthouse;
