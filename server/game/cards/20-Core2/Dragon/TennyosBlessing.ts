import { CardType, Players, Location, TargetMode, Decks } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class TennyosBlessing extends DrawCard {
    static id = 'tennyo-s-blessing';

    public setupCardAbilities() {
        this.action('Look at your dynasty deck')
            .target('target', {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== Location.StrongholdProvince
            }, AbilityDsl.actions.deckSearch({
                targetMode: TargetMode.UpTo,
                numCards: 2,
                amount: 4,
                shuffle: true,
                deck: Decks.DynastyDeck,
                selectedCardsHandler: (context, event, cards) => {
                    if(cards.length > 0) {
                        const target = context.target;
                        context.game.addMessage(
                            '{0} selects {1} and puts {2} into {3}',
                            event.player,
                            cards,
                            cards.length > 1 ? 'them' : 'it',
                            target?.facedown ? target.location : (target ?? '')
                        );
                        cards.forEach((card) => {
                            if(target) {
                                event.player.moveCard(card, target.location);
                            }
                            card.facedown = false;
                        });
                    } else {
                        context.game.addMessage('{0} selects no cards', event.player);
                    }
                }
            }))
            .evenDuringDynasty();
    }
}
