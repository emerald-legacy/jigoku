import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import type Player from '../../Player.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType, Players, TargetMode, Decks, EventName } from '../../Constants.js';

class TheWesternWind extends DrawCard {
    static id = 'the-western-wind';

    setupCardAbilities() {
        this.action({
            title: 'Look at your dynasty deck',
            condition: context => !!context.player.opponent &&
                context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince) > 0 &&
                context.player.dynastyDeck.length > 0,
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.location !== 'stronghold province',
                gameAction: AbilityDsl.actions.deckSearch({
                    cardCondition: (card) => card.type === CardType.Character,
                    targetMode: TargetMode.UpToVariable,
                    numCards: (context: AbilityContext) => context.player.getNumberOfOpponentsFaceupProvinces((province) => province.location !== Location.StrongholdProvince),
                    amount: 8,
                    deck: Decks.DynastyDeck,
                    selectedCardsHandler: (context: AbilityContext, event, cards: DrawCard[]) => {
                        const target = context.target as BaseCard;
                        const searchEvent = event as GameEvent<EventName.OnDeckSearch> & { player: Player };
                        if(cards.length > 0) {
                            this.game.addMessage('{0} selects {1} and puts {2} into {3}', searchEvent.player, cards, cards.length > 1 ? 'them' : 'it', target.facedown ? target.location : target);
                            cards.forEach((card: DrawCard) => {
                                searchEvent.player.moveCard(card, target.location);
                                card.facedown = false;
                            });
                        } else {
                            this.game.addMessage('{0} selects no characters', searchEvent.player);
                        }
                    }
                })
            }
        });
    }
}


export default TheWesternWind;
