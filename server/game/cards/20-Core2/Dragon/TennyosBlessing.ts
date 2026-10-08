import { msg } from '../../../GameChat.js';
import { CardType, Players, Location, TargetMode, DeckType } from '../../../Constants.js';
import { deckSearch } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TennyosBlessing extends DrawCard {
    static id = 'tennyo-s-blessing';

    public setupCardAbilities() {
        this.action('Look at your dynasty deck')
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== Location.StrongholdProvince
            }, deckSearch({
                mode: TargetMode.UpTo,
                numCards: 2,
                cardsToLookAt: 4,
                shuffle: true,
                deck: DeckType.Dynasty,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        const target = context.target;
                        context.game.addMessage(msg`${event.player} selects ${cards} and puts ${cards.length > 1 ? 'them' : 'it'} into ${target?.facedown ? target.location : (target ?? '')}`);
                        cards.forEach((card) => {
                            if(target) {
                                event.player.moveCard(card, target.location);
                            }
                            card.facedown = false;
                        });
                    } else {
                        context.game.addMessage(msg`${event.player} selects no cards`);
                    }
                }
            }))
            .evenDuringDynasty();
    }
}
