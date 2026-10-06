import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { deckSearch, moveCard } from '../../GameActions/GameActions.js';

class AlibiArtist extends DrawCard {
    static id = 'alibi-artist';

    setupCardAbilities() {
        this.action('Look at top 2 cards of conflict deck')
            .condition(context => context.player.honor <= 6)
            .gameAction(deckSearch({
                amount: 2,
                gameAction: moveCard({
                    destination: Location.Hand
                }),
                shuffle: false,
                reveal: false,
                placeOnBottomInRandomOrder: true
            }))
            .effect('look at the top two cards of their conflict deck');
    }
}


export default AlibiArtist;
