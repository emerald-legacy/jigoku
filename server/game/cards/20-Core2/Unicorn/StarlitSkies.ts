import { Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';
import { DeckChoice } from '../../DeckChoice.js';
import { discardBottomTop } from '../../discardBottomTop.js';

const decks = new DeckChoice({ players: Players.Self, pile: 'deck' });

export default class StarlitSkies extends DrawCard {
    static id = 'starlit-skies';

    override setupCardAbilities() {
        this.action('Look at top 3 cards')
            .evenDuringDynasty()
            .selectFrom({
                activePromptTitle: 'Choose which deck to look at:'
            }, decks.choices(discardBottomTop))
            .chatText((context) => msg`look at the top 3 cards of ${decks.chosenName(context)}`);
    }
}
