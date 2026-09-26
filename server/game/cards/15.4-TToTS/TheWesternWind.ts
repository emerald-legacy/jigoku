import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType, Players, TargetMode, Decks } from '../../Constants.js';

class TheWesternWind extends DrawCard {
    static id = 'the-western-wind';

    setupCardAbilities() {
        this.action('Look at your dynasty deck')
            .condition(context => !!context.player.opponent &&
                context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince) > 0 &&
                context.player.dynastyDeck.length > 0)
            .target('target', {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== 'stronghold province'
            }, AbilityDsl.actions.deckSearch({
                cardCondition: (card) => card.type === CardType.Character,
                targetMode: TargetMode.UpToVariable,
                numCards: (context: AbilityContext) => context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince),
                amount: 8,
                deck: Decks.DynastyDeck,
                selectedCardsHandler: (context: AbilityContext, event, cards: DrawCard[]) => {
                    const target = context.target;
                    if(!target) {
                        return;
                    }
                    if(cards.length > 0) {
                        this.game.addMessage('{0} selects {1} and puts {2} into {3}', event.player, cards, cards.length > 1 ? 'them' : 'it', target.facedown ? target.location : target);
                        cards.forEach((card: DrawCard) => {
                            event.player.moveCard(card, target.location);
                            card.facedown = false;
                        });
                    } else {
                        this.game.addMessage('{0} selects no characters', event.player);
                    }
                }
            }));
    }
}


export default TheWesternWind;
