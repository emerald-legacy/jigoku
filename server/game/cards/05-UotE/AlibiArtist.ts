import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AlibiArtist extends DrawCard {
    static id = 'alibi-artist';

    setupCardAbilities() {
        this.action({
            title: 'Look at top 2 cards of conflict deck',
            condition: context => context.player.honor <= 6,
            effect: 'look at the top two cards of their conflict deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 2,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                }),
                shuffle: false,
                reveal: false,
                placeOnBottomInRandomOrder: true
            })
        });
    }
}


export default AlibiArtist;
