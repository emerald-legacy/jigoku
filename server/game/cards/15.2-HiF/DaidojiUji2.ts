import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { placeCardUnderneath } from '../../GameActions/GameActions.js';
import { TargetMode, DeckType } from '../../Constants.js';
import { playableFromUnderneath } from '../cardsUnderneath.js';

class DaidojiUji2 extends DrawCard {
    static id = 'daidoji-uji-2';

    override setupCardAbilities() {
        this.reaction('Search your conflict deck')
            .when({ onCharacterEntersPlay: (event, context) => event.card === context.source })
            .deckSearch({
                mode: TargetMode.UpTo,
                numCards: 4,
                deck: DeckType.Conflict,
                reveal: false,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        this.game.addMessage(msg`${event.player} selects ${cards.length} cards`);
                        cards.forEach((card) => placeCardUnderneath({ destination: this }).resolve(card, context));
                    } else {
                        this.game.addMessage(msg`${event.player} selects no cards`);
                    }
                }
            });

        this.persistentEffect({
            condition: (context) => context.source.isHonored,
            ...playableFromUnderneath(this)
        });
    }
}


export default DaidojiUji2;
