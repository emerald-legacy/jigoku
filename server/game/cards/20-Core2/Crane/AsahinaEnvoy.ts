import { msg } from '../../../GameChat.js';
import { deckSearch } from '../../../GameActions/GameActions.js';
import { CardType, DeckType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class AsahinaEnvoy extends DrawCard {
    static id = 'asahina-envoy';

    setupCardAbilities() {
        this.interrupt('Put a character into a province')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== Location.StrongholdProvince
            }, deckSearch({
                cardCondition: (card) =>
                    card.type === CardType.Character && (card.printedCost ?? 0) >= 4 && card.isFaction('crane'),
                cardsToLookAt: 6,
                deck: DeckType.Dynasty,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length === 0) {
                        return this.game.addMessage(msg`${event.player} selects no characters`);
                    }

                    const target = context.target;
                    this.game.addMessage(msg`${event.player} selects ${cards} and puts it into ${target?.facedown ? target.location : (target ?? '')}`);

                    for(const card of cards) {
                        if(target) {
                            event.player.moveCard(card, target.location);
                        }
                        card.facedown = false;
                    }
                }
            }))
            .chatText('put a character from their deck into a province');
    }
}
