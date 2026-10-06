import DrawCard from '../../../DrawCard.js';
import { deckSearch, placeCardUnderneath } from '../../../GameActions/GameActions.js';
import { playableFromUnderneath } from '../../cardsUnderneath.js';

class KakitaTaneharu extends DrawCard {
    static id = 'kakita-taneharu';

    setupCardAbilities() {
        this.conflictAction('Search your conflict deck', { evenFromHome: true })
            .gameAction(deckSearch({
                amount: 4,
                reveal: false,
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                message: '{0} puts a card underneath {1}',
                messageArgs: context => {
                    return [context.player, context.source];
                },
                gameAction: placeCardUnderneath({
                    destination: this
                })
            }));

        this.persistentEffect(playableFromUnderneath(this));
    }
}


export default KakitaTaneharu;
