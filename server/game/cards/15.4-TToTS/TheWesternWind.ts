import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes, Players, TargetModes, Decks } from '../../Constants.js';

class TheWesternWind extends DrawCard {
    static id = 'the-western-wind';

    setupCardAbilities() {
        this.action({
            title: 'Look at your dynasty deck',
            condition: context => !!context.player.opponent &&
                context.player.getNumberOfOpponentsFaceupProvinces((province: any) => province.location !== Locations.StrongholdProvince) > 0 &&
                context.player.dynastyDeck.length > 0,
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card: any) => card.location !== 'stronghold province',
                gameAction: AbilityDsl.actions.deckSearch({
                    cardCondition: (card: any) => card.type === CardTypes.Character,
                    targetMode: TargetModes.UpToVariable,
                    numCards: (context: any) => context.player.getNumberOfOpponentsFaceupProvinces((province: any) => province.location !== Locations.StrongholdProvince),
                    amount: 8,
                    deck: Decks.DynastyDeck,
                    selectedCardsHandler: (context: any, event: any, cards: any) => {
                        if(cards.length > 0) {
                            this.game.addMessage('{0} selects {1} and puts {2} into {3}', event.player, cards, cards.length > 1 ? 'them' : 'it', context.target.facedown ? context.target.location : context.target);
                            cards.forEach((card: any) => {
                                event.player.moveCard(card, context.target.location);
                                card.facedown = false;
                            });
                        } else {
                            this.game.addMessage('{0} selects no characters', event.player);
                        }
                    }
                })
            }
        });
    }
}


export default TheWesternWind;
