import { msg } from '../../../GameChat.js';
import { CardType, Players, Location, TargetMode, DeckType } from '../../../Constants.js';
import { deckSearch, placeInProvince } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { perRound } from '../../../AbilityLimit.js';

export default class TennyosBlessing extends DrawCard {
    static id = 'tennyo-s-blessing';

    public override setupCardAbilities() {
        this.action('Look at your dynasty deck')
            .evenDuringDynasty()
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== Location.StrongholdProvince
            }, deckSearch((context) => ({
                target: context.player,
                mode: TargetMode.UpTo,
                numCards: 2,
                cardsToLookAt: 4,
                deck: DeckType.Dynasty,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        const target = context.target;
                        context.game.addMessage(msg`${event.player} selects ${cards} and puts ${cards.length > 1 ? 'them' : 'it'} into ${target?.facedown ? target.location : (target ?? '')}`);
                        if(target) {
                            cards.forEach((card) => placeInProvince({ destination: target.location }).resolve(card, context));
                        }
                    } else {
                        context.game.addMessage(msg`${event.player} selects no cards`);
                    }
                }
            })))
            .max(perRound(1));
    }
}
