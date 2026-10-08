import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { placeCardUnderneath } from '../../../GameActions/GameActions.js';
import { playableFromUnderneath } from '../../cardsUnderneath.js';

class KakitaTaneharu extends DrawCard {
    static id = 'kakita-taneharu';

    setupCardAbilities() {
        this.conflictAction('Search your conflict deck', { evenFromHome: true })
            .deckSearch({
                cardsToLookAt: 4,
                reveal: false,
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                message: (context) => msg`${context.player} puts a card underneath ${context.source}`,
                gameAction: placeCardUnderneath({
                    destination: this
                })
            });

        this.persistentEffect(playableFromUnderneath(this));
    }
}


export default KakitaTaneharu;
